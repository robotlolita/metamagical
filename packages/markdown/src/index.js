//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// -- DEPENDENCIES -----------------------------------------------------
const yaml        = require('js-yaml');
const marked      = require('marked');
const generateJs  = require('babel-generator').default;
const template    = require('babel-template');
const parseJs     = require('babylon').parse;
const t           = require('babel-types');
const babel       = require('babel-core');


// -- ALIASES ----------------------------------------------------------
const extend = Object.assign;
const keys   = Object.keys;


// -- TEMPLATES --------------------------------------------------------
const moduleTemplate = template(`
  module.exports = {};
  module.exports[Symbol.for('@@meta:magical')] = META
`);


// -- HELPERS ----------------------------------------------------------
function Raw(value) {
  this.value = value;
}

function objectToExpression(object) {
  return t.objectExpression(
    entries(object).map(pairToProperty)
  );
}

function pairToProperty([key, value]) {
  return t.objectProperty(
    t.stringLiteral(key),
    valueToLiteral(value)
  );
}

function valueToLiteral(value) {
  return value instanceof Raw ?  value.value
  :      Array.isArray(value) ?  t.arrayExpression(value.map(valueToLiteral))
  :      isString(value)      ?  t.stringLiteral(value)
  :      isBoolean(value)     ?  t.booleanLiteral(value)
  :      isNumber(value)      ?  t.numericLiteral(value)
  :      isObject(value)      ?  objectToExpression(value)
  :      /* otherwise */         raise(new TypeError(`Type of property not supported: ${value}`));
}

function raise(error) {
  throw error;
}

function isString(value) {
  return typeof value === 'string';
}

function isBoolean(value) {
  return typeof value === 'boolean';
}

function isNumber(value) {
  return typeof value === 'number';
}

function isObject(value) {
  return Object(value) === value;
}

function flatten(lists) {
  return lists.reduce((a, b) => a.concat(b), []);
}

function hasYaml(source) {
  return /^\s*---[\n\r]/.test(source);
}

function enumerate(list) {
  return list.map((element, index) => [element, index]);
}

function entries(object) {
  return keys(object).map(key => [key, object[key]]);
}

function compact(object) {
  let result = {};

  entries(object).forEach(([key, value]) => {
    if (value != null) {
      result[key] = value;
    }
  });

  return result;
}

function groupBy(grouping, list) {
  return list.reduce((result, value) => {
    const key    = grouping(value);
    const values = result.get(key) || [];

    result.set(key, values.concat([value]));

    return result;
  }, new Map());
}

function cleanDocumentation(text) {
  return text.replace(/^::$/gm, '').replace(/::[ \t]*$/gm, ':');
}

function parseMultiDocument(source) {
  const lines = source.split(/\r\n|\n\r|\n|\r/);
  const marks = enumerate(lines).filter(([line, _]) => line === '---');
  if (marks.length < 2) {
    throw new SyntaxError('Invalid YAML document.');
  }

  const [[_, start], [__, end]] = marks;
  const yamlPart     = lines.slice(start + 1, end).join('\n');
  const markdownPart = lines.slice(end + 1);

  let meta = yaml.safeLoad(yamlPart) || {};
  meta.documentation = cleanDocumentation(markdownPart.join('\n'));

  return [meta, markdownPart.join('\n')];
}

function pairNodes(ast) {
  return ast.map((node, index) => [node, ast[index - 1]]);
}

function isLeadingExampleNode(node) {
  return node
  &&     (node.type === 'paragraph' || node.type === 'heading')
  &&     /::\s*$/.test(node.text);
}

function functionFromExamples(sources, options) {
  const body = flatten(sources.map(s => parseJs(s).program.body));

  const { _code, _map, ast } = babel.transformFromAst(t.program(body), null, options);

  return new Raw(t.functionExpression(
    null,
    [],
    t.blockStatement(ast.program.body)
  ));
}

function inferTitle(ast) {
  for (let node of ast) {
    if (node.type === 'heading' && node.depth === 1) {
      return node.text;
    }
  }

  return null;
}

function parseExamples(ast) {
  return pairNodes(ast).reduce(({ examples, heading }, [node, previous]) => {
    switch (node.type) {
      case 'heading':
        return { examples, heading: node.text };

      case 'code':
        if (isLeadingExampleNode(previous)) {
          return {
            examples: examples.concat([{ heading, code: node.text }]),
            heading:  heading
          };
        } else {
          return { examples, heading };
        }

      default:
        return { examples, heading };
    }
  }, { examples: [], heading: null }).examples;
}

function inferExamples(ast, options) {
  const groups = Array.from(groupBy(x => x.heading, parseExamples(ast)).entries());

  return groups.map(([heading, examples]) => {
    const sources = examples.map(x => x.code);

    return heading == null ?  functionFromExamples(sources, options)
    :      /* otherwise */    {
                                name: heading.replace(/::\s*$/, ''),
                                call: functionFromExamples(sources, options)
                              };
  });
}

function inferMeta(meta, markdown, options) {
  return extend(compact({
    name:     inferTitle(markdown),
    examples: inferExamples(markdown, options)
  }), meta);
}


// -- IMPLEMENTATION ---------------------------------------------------
function parse(source, options) {
  if (hasYaml(source)) {
    const [meta, markdown] = parseMultiDocument(source);
    return inferMeta(meta, marked.lexer(markdown), options);
  } else {
    return inferMeta({ documentation: source }, marked.lexer(source), options);
  }
}

function generate(meta) {
  const ast = moduleTemplate({ META: objectToExpression(meta) });
  return generateJs(t.program(ast)).code;
}


// -- EXPORTS ----------------------------------------------------------
module.exports = {
  parse, generate
};
