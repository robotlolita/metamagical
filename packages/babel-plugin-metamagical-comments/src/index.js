//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


// -- DEPENDENCIES -----------------------------------------------------
const yaml      = require('js-yaml');
const marked    = require('marked');
const { parse } = require('babylon');
const template  = require('babel-template');
const generate  = require('babel-generator').default;


// -- CONSTANTS --------------------------------------------------------
const COMPUTED = true; /* computed properties */


// -- HELPERS ----------------------------------------------------------
function metamagical_withMeta(object, meta) {
  var oldMeta = object[Symbol.for('@@meta:magical')] || {};

  Object.keys(meta).forEach(function(key) {
    oldMeta[key] = meta[key];
  });
  object[Symbol.for('@@meta:magical')] = oldMeta;

  return object;
}

const withMeta = template(
  `__metamagical_withMeta(OBJECT, META)`
)

function merge(...args) {
  return Object.assign({}, ...args);
}

function isDocComment(comment) {
  return comment.type === 'CommentBlock'
  &&     /^~\s*$/m.test(comment.value);
}

function last(xs) {
  return xs[xs.length - 1];
}

function getDocComment(node) {
  const comment = last(node.leadingComments || []);

  return comment && isDocComment(comment) ?   comment.value
  :      /* otherwise */                      null;
}

function parseDoc(doc) {
  const parts = doc.replace(/^~[ \t]*$/m, '')
                 .replace(/^[ \t]*\*[ \t]?/gm, '')
                 .split(/\n[ \t]*-{3,}[ \t]*\n/);

  let meta = yaml.safeLoad(parts[1] || '') || {};
  meta.documentation = parts[0] || '';
  return meta;
}

function pairs(object) {
  return Object.keys(object).map(key => [key, object[key]]);
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

function isExampleLeadingParagraph(node) {
  return node
  &&     (node.type === 'paragraph' || node.type === 'heading')
  &&     /::\s*$/.test(node.text)
}

function inferExampleName(node) {
  if (!node || node.type !== 'heading') {
    return null;
  } else {
    return node.text.replace(/::[ \t]*$/m, '');
  }
}

function collectExamples(documentation) {
  const ast = marked.lexer(documentation);

  return ast.map((node, i) => [node, ast[i - 1]])
            .filter(([node, prev]) => node.type === 'code' && isExampleLeadingParagraph(prev))
            .map(([node, previous]) => ({
              source: node.text,
              name: inferExampleName(previous)
            }));
}

function Raw(value) {
  this.value = value;
}


// -- IMPLEMENTATION ---------------------------------------------------
module.exports = function({ types: t }) {
  const withMetaFD  = parse(metamagical_withMeta.toString()).program.body[0];
  const withMetaAST = t.functionExpression(
    t.identifier('metamagical_withMeta'),
    withMetaFD.params,
    withMetaFD.body
  );


  // --- HELPERS -------------------------------------------------------
  function toIdentifier({ name }) {
    return name        ?  t.Identifier(name)
    :      /* else */     null;
  }

  function intoExampleFunction(source, ast) {
    const body = ast.program.body;

    return new Raw(withMeta({
      OBJECT: t.functionExpression(
        null,   // id
        [],     // params
        t.blockStatement(body),
        false,  // generator
        false   // async
      ),
      META: mergeMeta({ source })
    }).expression);
  }

  function parseExample({ name, source }) {
    return name       ?  { name, call: intoExampleFunction(source, parse(source)), inferred: true }
    :      /* else */    { name: '', call: intoExampleFunction(source, parse(source)), inferred: true };
  }

  function inferName(id, computed) {
    return t.isIdentifier(id) && !computed ?  { name: id.name }
    :      t.isMemberExpression(id)        ?  inferName(id.property, id.computed)
    :      /* otherwise */                    {};
  }

  function inferExamples(documentation) {
    const examples = collectExamples(documentation || '');

    return examples.length > 0?  { examples: examples.map(parseExample) }
    :      /* otherwise */       { };
  }

  function inferSignature(expr, name) {
    if (!t.isFunctionExpression(expr) && !t.isFunctionDeclaration(expr)) {
      return { };
    }
    if (!t.isIdentifier(name)) {
      return { };
    }

    const { code } = generate(t.functionExpression(
      name,
      expr.params,
      t.blockStatement([]),
      expr.generator,
      expr.async
    ));

    return {
      signature: code.replace(/^\s*async function/, 'async')
                     .replace(/^\s*function/, '')
                     .replace(/\s*{\s*\}\s*$/, '')
    }
  }

  function hasLocation(object) {
    return object && 'start' in object && 'end' in object;
  }

  function sourceFrom(code, start, end) {
    return code != null && start != null && end != null ?  { source: code.slice(start, end) }
    :      /* otherwise */                                 { };
  }

  function isTransformedMethod(path, node) {
    return t.isObjectProperty(path.node)
    &&     t.isFunctionExpression(node)
    &&     !hasLocation(node)
    &&     hasLocation(node.body);
  }

  function generateObjectMethod(node, bodySource) {
    const { code } = generate(t.objectMethod(
      "method",
      node.key,
      node.value.params,
      t.blockStatement([]),
      node.computed
    ));
    return code.replace(/\{\s*\}\s*$/, '') + bodySource;
  }

  function inferSource(path, node) {
    const code = path.hub.file.code;
    if (hasLocation(node)) {
      return sourceFrom(code, node.start, node.end);
    } else if (isTransformedMethod(path, node)) {
      const { start, end } = node.body;
      const { source }     = sourceFrom(code, start, end);
      if (source) {
        return { source: generateObjectMethod(path.node, source) }
      } else {
        return { };
      }
    } else {
      return { }
    }
  }

  function objectToExpression(object) {
    return t.objectExpression(
      pairs(object).map(pairToProperty)
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

  function mergeMeta(...args) {
    let fullMeta = merge(...args);

    if (fullMeta.documentation) {
      const doc = fullMeta.documentation;
      fullMeta = merge(fullMeta, inferExamples(doc));
      fullMeta.documentation = doc.replace(/^::$/gm, '').replace(/::[ \t]*$/gm, ':');
    }

    return objectToExpression(fullMeta);
  }

  function includeHelper(path) {
    if (!path.hub.file.scope.hasBinding('__metamagical_withMeta')) {
      path.hub.file.scope.push({
        id:   t.identifier('__metamagical_withMeta'),
        init: withMetaAST
      });
    }
  }


  // --- PUBLIC TRANSFORM ----------------------------------------------
  const visitor = {
    FunctionDeclaration(path, _state) {
      const doc = getDocComment(path.node);

      if (doc) {
        includeHelper(path);
        path.insertAfter(withMeta({
          OBJECT: path.node.id,
          META:   mergeMeta(
            { name: path.node.id.name },
            inferSource(path, path.node),
            inferSignature(path.node, path.node.id),
            parseDoc(doc)
          )
        }));
      }
    },

    VariableDeclaration(path, _state) {
      if (path.node.declarations.length === 1) {
        const declarator = path.node.declarations[0];
        const doc = getDocComment(path.node);

        if (doc && declarator.init) {
          includeHelper(path);
          declarator.init = withMeta({
            OBJECT: declarator.init,
            META:   mergeMeta(
              inferName(declarator.id),
              inferSource(path, declarator.init),
              inferSignature(declarator.init, declarator.id),
              parseDoc(doc)
            )
          }).expression;
        }
      }
    },

    ExpressionStatement(path, _state) {
      const expr = path.node.expression;
      if (t.isAssignmentExpression(expr)) {
        const doc = getDocComment(path.node);
        if (doc) {
          const name = inferName(expr.left);

          includeHelper(path);
          expr.right = withMeta({
            OBJECT: expr.right,
            META:   mergeMeta(
              name,
              inferSource(path, expr.right),
              inferSignature(expr.right, toIdentifier(name)),
              parseDoc(doc)
            )
          }).expression
        }
      }
    },

    ObjectProperty(path, _state) {
      const doc = getDocComment(path.node);
      if (doc) {
        const name = inferName(path.node.key, path.node.computed);

        includeHelper(path);
        path.node.value = withMeta({
          OBJECT: path.node.value,
          META:   mergeMeta(
            name,
            inferSource(path, path.node.value),
            inferSignature(path.node.value, toIdentifier(name)),
            parseDoc(doc)
          )
        }).expression;
      }
    },

//    ObjectMethod(path, _state) {
//      const doc = getDocComment(path.node);
//      if (doc) {
//        if (!path.node.method) {
//          console.warn('Getters and setters are not supported in Meta:Magical\'s babel plugin.');
//          return;
//        }
//
//        const fn = t.functionExpression(
//          path.node.computed ?  null : path.node.key,
//          path.node.params,
//          path.node.body,
//          path.node.generator,
//          path.node.async
//        );
//
//        // Babel will invoke ObjectProperty on this newly created node
//        // This is a problem :<
//        path.replaceWith(
//          t.objectProperty(path.node.key, fn, path.node.computed)
//        );
//      }
//    }
  };

  return { visitor };
};
