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


// -- CONSTANTS --------------------------------------------------------
const COMPUTED = true; /* computed properties */


// -- HELPERS ----------------------------------------------------------
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

  // --- HELPERS -------------------------------------------------------
  function metaSymbol() {
    return t.callExpression(
      t.memberExpression(
        t.identifier('Symbol'),
        t.identifier('for')
      ),
      [t.stringLiteral('@@meta:magical')]
    );
  }

  function intoExampleFunction(path, source, ast) {
    const body = ast.program.body;

    return new Raw(wrapRValue(t.functionExpression(
      null,   // id
      [],     // params
      t.blockStatement(body),
      false,  // generator
      false   // async
    ), { source }, path.hub.file));
  }

  function parseExample(path, { name, source }) {
    return name       ?  { name, call: intoExampleFunction(path, source, parse(source)) }
    :      /* else */    intoExampleFunction(path, source, parse(source));
  }

  function inferName(id, computed) {
    return t.isIdentifier(id) && !computed ?  { name: id.name }
    :      t.isMemberExpression(id)        ?  inferName(id.property, id.computed)
    :      /* otherwise */                    {};
  }

  function inferExamples(path, documentation) {
    const examples = collectExamples(documentation || '');

    return examples.length > 0?  { examples: examples.map(e => parseExample(path, e)) }
    :      /* otherwise */       { };
  }

  function inferSource(path) {
    const code = path.hub.file.code;

    return code       ?  { source: code.slice(path.node.start, path.node.end) }
    :      /* else */    { }
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

  function setMeta(path, lvalue, meta) {
    const doc = meta.documentation;
    if (doc) {
      return t.assignmentExpression(
        '=',
        t.memberExpression(lvalue, metaSymbol(), COMPUTED),
        objectToExpression(Object.assign(meta, inferExamples(path, doc), {
          documentation: doc.replace(/^::$/gm, '').replace(/::[ \t]*$/gm, ':')
        }))
      );
    } else {
      return t.assignmentExpression(
        '=',
        t.memberExpression(lvalue, metaSymbol(), COMPUTED),
        objectToExpression(meta)
      );
    }
  }

  function assignMeta(binding, doc, path, additionalMeta) {
    if (doc) {
      const meta = Object.assign(additionalMeta || {}, parseDoc(doc));
      path.insertAfter(t.expressionStatement(setMeta(path, binding, meta)));
    }
  }

  function wrapRValue(expr, meta, path, bindingName) {
    const id = path.scope.generateUidIdentifier(bindingName || 'ref');
    path.scope.push({ id });

    return t.sequenceExpression([
      t.assignmentExpression('=', id, expr),
      setMeta(path, id, meta),
      id
    ]);
  }


  // --- PUBLIC TRANSFORM ----------------------------------------------
  const visitor = {
    FunctionDeclaration(path, _state) {
      assignMeta(
        path.node.id,
        getDocComment(path.node),
        path,
        merge({
          name: path.node.id.name,
        }, inferSource(path))
      );
    },

    VariableDeclaration(path, _state) {
      if (path.node.declarations.length === 1) {
        const declarator = path.node.declarations[0];
        assignMeta(
          declarator.id,
          getDocComment(path.node),
          path,
          merge(inferName(declarator.id), inferSource(path))
        );
      }
    },

    ExpressionStatement(path, _state) {
      const expr = path.node.expression;
      if (t.isAssignmentExpression(expr)) {
        const doc = getDocComment(path.node);
        if (doc) {
          const inferredMeta = inferName(expr.left);
          const meta = Object.assign(inferredMeta, inferSource(path), parseDoc(doc));

          expr.right = wrapRValue(expr.right, meta, path, inferredMeta.name);
        }
      }
    },

    ObjectProperty(path, _state) {
      const doc = getDocComment(path.node);
      if (doc) {
        const inferredMeta = inferName(path.node.key, path.node.computed);
        const meta = Object.assign(inferredMeta, inferSource(path), parseDoc(doc));

        path.node.value = wrapRValue(path.node.value, meta, path, inferredMeta.name);
      }
    },

    ObjectMethod(path, _state) {
      const doc = getDocComment(path.node);
      if (doc) {
        if (!path.node.method) {
          console.warn('Getters and setters are not supported in Meta:Magical\'s babel plugin.');
          return;
        }

        const fn = t.functionExpression(
          path.node.computed ?  null : path.node.key,
          path.node.params,
          path.node.body,
          path.node.generator,
          path.node.async
        );

        // Babel will invoke ObjectProperty on this newly created node
        // This is a problem :<
        path.replaceWith(
          t.objectProperty(path.node.key, fn, path.node.computed)
        );
      }
    }
  };

  return { visitor };
};
