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

  function assignMeta(path, node, binding) {
    const doc = getDocComment(node);
    if (doc) {
      const meta = parseDoc(doc);
      path.insertAfter(
        t.expressionStatement(
          t.assignmentExpression(
            '=',
            t.memberExpression(binding, metaSymbol(), COMPUTED),
            objectToExpression(meta)
          )
        )
      );
    }
  }


  return {
    visitor: {
      FunctionDeclaration(path, state) {
        assignMeta(path, path.node, t.identifier(path.node.id.name));
      },

      VariableDeclaration(path, state) {
        if (path.node.declarations.length === 1) {
          const declarator = path.node.declarations[0];
          assignMeta(path, path.node, t.identifier(declarator.id.name));
        }
      }
    }
  };
};
