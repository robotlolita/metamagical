//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// Copyright (C) 2015-2016 Quildreen Motta.
// Licensed under the MIT licence.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const yaml = require('js-yaml');


const COMPUTED = true; /* computed properties */


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
  const parts = doc.replace(/^~\s*$/m, '')
                 .replace(/^\s*\*\s/gm, '')
                 .split(/\n\s*-{3,}\s*\n/);

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


module.exports = function({ types: t }) {
  function metaSymbol() {
    return t.callExpression(
      t.memberExpression(
        t.identifier('Symbol'),
        t.identifier('for')
      ),
      [t.stringLiteral('@@meta:magical')]
    );
  }

  function inferName(id, computed) {
    return t.isIdentifier(id) && !computed?  { name: id.name }
    :      t.isMemberExpression(id)?         inferName(id.property, id.computed)
    :      /* otherwise */                   {};
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
    return Array.isArray(value) ?  t.arrayExpression(value.map(valueToLiteral))
    :      isString(value)      ?  t.stringLiteral(value)
    :      isBoolean(value)     ?  t.booleanLiteral(value)
    :      isNumber(value)      ?  t.numericLiteral(value)
    :      isObject(value)      ?  objectToExpression(value)
    :      /* otherwise */         raise(new TypeError('Type of property not supported: ' + value));
  }

  function setMeta(lvalue, meta) {
    return t.assignmentExpression(
      '=',
      t.memberExpression(lvalue, metaSymbol(), COMPUTED),
      objectToExpression(meta)
    );
  }

  function assignMeta(binding, doc, path, additionalMeta) { // path, node, binding) {
    if (doc) {
      const meta = Object.assign(parseDoc(doc), additionalMeta || {});
      path.insertAfter(t.expressionStatement(setMeta(binding, meta)));
    }
  }

  function wrapRValue(expr, meta, path, bindingName) {
    const id = path.scope.generateUidIdentifier(bindingName || "ref");
    path.scope.push({ id });

    return t.sequenceExpression([
      t.assignmentExpression('=', id, expr),
      setMeta(id, meta),
      id
    ]);
  }


  const visitor = {
    FunctionDeclaration(path, state) {
      assignMeta(path.node.id, getDocComment(path.node), path, {
        name: path.node.id.name
      });
    },

    VariableDeclaration(path, state) {
      if (path.node.declarations.length === 1) {
        const declarator = path.node.declarations[0];
        assignMeta(declarator.id, getDocComment(path.node), path, inferName(declarator.id));
      }
    },

    ExpressionStatement(path, state) {
      const expr = path.node.expression;
      if (t.isAssignmentExpression(expr)) {
        const doc = getDocComment(path.node);
        if (doc) {
          const inferredMeta = inferName(expr.left);
          const meta = Object.assign(parseDoc(doc), inferredMeta);

          expr.right = wrapRValue(expr.right, meta, path, inferredMeta.name);
        }
      }
    },

    ObjectProperty(path, state) {
      const doc = getDocComment(path.node);
      if (doc) {
        const inferredMeta = inferName(path.node.key, path.node.computed);
        const meta = Object.assign(parseDoc(doc), inferredMeta);

        path.node.value = wrapRValue(path.node.value, meta, path, inferredMeta.name);
      }
    },

    ObjectMethod(path, state) {
      const inferredMeta = inferName(path.node.key, path.node.computed);
      const fn = t.functionExpression(
        path.node.computed? null : path.node.key,
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
  };

  return { visitor };
};
