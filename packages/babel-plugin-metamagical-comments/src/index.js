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

const fs   = require('fs');
const path = require('path');


// -- CONSTANTS --------------------------------------------------------
const COMPUTED = true; /* computed properties */


// -- HELPERS ----------------------------------------------------------
function exists(pathString) {
  try {
    fs.accessSync(pathString);
    return true;
  } catch (_) {
    return false;
  }
}

function read(fileName) {
  return fs.readFileSync(fileName, 'utf-8');
}

const readPackage = function() {
  let cache = new Map();

  return (pathString) => {
    const realPath = path.resolve(pathString);

    if (cache.has(realPath)) {
      return cache.get(realPath);
    } else if (exists(path.join(realPath, 'package.json'))) {
      try {
        const data = {
          file: realPath,
          contents: JSON.parse(read(path.join(realPath, 'package.json')))
        }
        cache.set(realPath, data);
        return data;
      } catch (_) {
        const data = {
          file: realPath,
          contents: { }
        };
        cache.set(realPath, data);
        return data;
      }
    } else {
      const parent = path.resolve(pathString, '..');
      if (realPath === parent) {
        return { };
      } else {
        return readPackage(parent);
      }
    }
  }
}();

function computeModuleId(name, root, file) {
  let modulePath = path.relative(root, file);
  if (path.extname(modulePath) === '.js') {
    modulePath = modulePath.slice(0, -3);
  }
  if (path.basename(modulePath) === 'index') {
    modulePath = path.dirname(modulePath);
  }
  return path.join(name, modulePath).replace(/\/$/, '');
}

function metamagical_withMeta(object, meta) {
  const parent  = Object.getPrototypeOf(object);
  let oldMeta   = object[Symbol.for('@@meta:magical')] || {};
  if (parent && parent[Symbol.for('@@meta:magical')] === oldMeta) {
    oldMeta = {};
  }

  Object.keys(meta).forEach(function(key) {
    if (/^~/.test(key)) {
      oldMeta[key.slice(1)] = meta[key];
    } else {
      oldMeta[key] = meta[key];
    }
  });
  object[Symbol.for('@@meta:magical')] = oldMeta;

  return object;
}

const withMeta = template(
  `__metamagical_withMeta(OBJECT, META)`
);

const getGetter = template(
  `Object.getOwnPropertyDescriptor(OBJECT, KEY).get`
);

const getSetter = template(
  `Object.getOwnPropertyDescriptor(OBJECT, KEY).set`
);

const getProperty = template(
  `OBJECT[KEY]`
);

function compact(object) {
  let result = {};

  Object.keys(object).forEach(key => {
    const value = object[key];
    if (value != null) {
      result[key] = value;
    }
  });

  return result;
}

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

function collectExamples(documentation) {
  const ast = marked.lexer(documentation);

  const [xs, x, name] = ast.reduce(([examples, current, heading, nextNodeIsExample], node) => {
    if (node.type === 'code') {
      if (nextNodeIsExample) {
        return [examples, [...current, node.text], heading, false];
      } else {
        return [examples, current, heading, false];
      }
    } else if (node.type === 'heading') {
      return [
        examples.concat({
          name: heading,
          source: current.join('\n\n')
        }),
        [],
        node.text,
        isExampleLeadingParagraph(node)
      ];
    } else if (node.type === 'paragraph') {
      return [examples, current, heading, isExampleLeadingParagraph(node)];
    } else {
      return [examples, current, heading, false];
    }
  }, [[], [], null, false]);

  if (x.length === 0) {
    return xs;
  } else {
    return [...xs, {
      name: name,
      source: x.join('\n;\n')
    }];
  }
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

  function lazy(expr) {
    return t.functionExpression(
      null,
      [],
      t.blockStatement([
        t.returnStatement(expr)
      ])
    );
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

  function findClosestParent(path, predicate) {
    return !path.parentPath           ?  null
    :      predicate(path.parentPath) ?  path.parentPath
    :      /* otherwise */               findClosestParent(path.parentPath, predicate);
  }

  function isModuleExports(lvalue) {
    return t.isIdentifier(lvalue.object)
    &&     lvalue.object.name === 'module'
    &&     t.isIdentifier(lvalue.property)
    &&     lvalue.property.name === 'exports';
  }

  function inferParent(lvalue) {
    if (t.isMemberExpression(lvalue) && !isModuleExports(lvalue)) {
      return { 'belongsTo': new Raw(lazy(lvalue.object)) };
    } else {
      return { };
    }
  }

  function getParentFromObjectProperty(path) {
    const parent = findClosestParent(path, p => {
      return t.isVariableDeclarator(p)
      ||     t.isAssignmentExpression(p)
      ||     t.isObjectProperty(p);
    });

    if (t.isVariableDeclarator(parent)) {
      return parent.node.id;
    } else if (t.isAssignmentExpression(parent)) {
      return parent.node.left;
    } else if (t.isObjectProperty(parent)) {
      const object = getParentFromObjectProperty(parent);
      if (t.isExpression(object)) {
        return t.memberExpression(
          object,
          parent.node.key,
          parent.node.computed
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  function inferParentFromObjectProperty(path) {
    const expr = getParentFromObjectProperty(path);
    return expr        ?  { 'belongsTo': new Raw(lazy(expr)) }
    :      /* else */     { };
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

  function expressionHasSignature(expr) {
    return t.isFunctionExpression(expr)
    ||     t.isFunctionDeclaration(expr)
    ||     t.isObjectMethod(expr)
    ||     t.isArrowFunctionExpression(expr);
  }

  function inferSignature(expr, name) {
    if (!expressionHasSignature(expr)) {
      return { };
    }
    if (!t.isIdentifier(name)) {
      return { };
    }

    let node = t.objectMethod(
      expr.kind || 'method',
      name,
      expr.params,
      t.blockStatement([]),
      false
    );
    node.async     = expr.async || false;
    node.generator = expr.generator || false;

    const { code } = generate(node);

    return {
      signature: code.replace(/\s*{\s*\}\s*$/, '')
                     .trim()
    };
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

  function anyPropertyHasDoc(object) {
    return object.properties.some(n => getDocComment(n) != null);
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

  function getRepository(repo) {
    return repo && repo.url ?  repo.url
    :      /* else */          null  // TODO: parse npm's repo syntax
  }

  function inferFileAttributes(babelPath) {
    const file = babelPath.hub.file.opts.filename;
    const pkg  = readPackage(file);

    if (!pkg || !pkg.file || !pkg.contents) {
      return { };
    } else {
      const { contents:p, file:root } = pkg;

      return Object.assign(
        compact({
          location: Object.assign({
            filename: path.relative(root, file),
          }, babelPath.node.loc || {}),
          module:     computeModuleId(p.name, root, file),
          homepage:   p.homepage,
          licence:    p.license || p.licence,
          authors:    [p.author].concat(p.contributors || []).filter(Boolean),
          repository: getRepository(p.repository),
          npmPackage: p.name
        }),
        p.metamagical || {}
      );
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
      valueToLiteral(value, key)
    );
  }

  const specialParsers = {
    '~belongsTo'(value) {
      const ast = parse(value);
      t.assertExpressionStatement(ast.program.body[0]);

      return lazy(ast.program.body[0].expression);
    }
  }

  function parseSpecialProperty(value, key) {
    return specialParsers[key](value);
  }

  function isSpecial(value, key) {
    return key && key in specialParsers;
  }

  function valueToLiteral(value, key) {
    return value instanceof Raw  ?  value.value
    :      Array.isArray(value)  ?  t.arrayExpression(value.map(x => valueToLiteral(x)))
    :      isSpecial(value, key) ?  parseSpecialProperty(value, key)
    :      isString(value)       ?  t.stringLiteral(value)
    :      isBoolean(value)      ?  t.booleanLiteral(value)
    :      isNumber(value)       ?  t.numericLiteral(value)
    :      isObject(value)       ?  objectToExpression(value)
    :      /* otherwise */          raise(new TypeError(`Type of property not supported: ${value}`));
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

  function accessorFor(node) {
    return node.kind === 'set' ?  getSetter
    :      node.kind === 'get' ?  getGetter
    :      /* otherwise */        getProperty;
  }

  function maybeFindBindingFrom(path) {
    const node = path.node;
    if (t.isExpressionStatement(node) && t.isAssignmentExpression(node.left)) {
      return node.left;
    } else if (t.isVariableDeclarator(node)) {
      return node.id;
    } else if (t.isExpression(node)) {
      return maybeFindBindingFrom(path.parentPath);
    } else {
      return null;
    }
  }

  function metaForProperty(path, objId, parentId, node) {
    const doc = getDocComment(node);
    if (doc) {
      const name  = inferName(node.key, node.computed);
      const meta  = parseDoc(doc);
      const value = t.isObjectProperty(node) ? node.value : node;

      return withMeta({
        OBJECT: accessorFor(node)({
          OBJECT: objId,
          KEY:    node.computed ? node.key
                  : /* else */    t.stringLiteral(node.key.name)
        }),
        META:   mergeMeta(
          name,
          inferSource(path, value),
          inferSignature(value, toIdentifier(name)),
          parentId ? { belongsTo: new Raw(lazy(parentId)) } : {},
          parentId ? { } : inferFileAttributes(path),
          meta
        )
      }).expression;
    } else {
      return null;
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
            inferFileAttributes(path),
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
              inferFileAttributes(path),
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
          const name      = inferName(expr.left);
          const parent    = inferParent(expr.left);
          const meta      = parseDoc(doc);
          const hasParent = meta['~belongsTo'] || parent.belongsTo;

          includeHelper(path);
          expr.right = withMeta({
            OBJECT: expr.right,
            META:   mergeMeta(
              name,
              inferSource(path, expr.right),
              inferSignature(expr.right, toIdentifier(name)),
              parent,
              hasParent ? {} : inferFileAttributes(path),
              isModuleExports(expr.left) ? { isModule: true } : { },
              meta
            )
          }).expression
        }
      }
    },

    ObjectExpression(path, _state) {
      const { node, scope, parent } = path;

      if (anyPropertyHasDoc(node)) {
        const id      = scope.generateUidIdentifierBasedOnNode(parent);
        const binding = maybeFindBindingFrom(path);
        const meta    = node.properties.map(x => metaForProperty(path, id, binding, x))
                                       .filter(Boolean);

        includeHelper(path);
        scope.push({ id });
        path.replaceWith(
          t.sequenceExpression([
            t.assignmentExpression(
              '=',
              id,
              t.objectExpression(node.properties.map(p =>
                t.isObjectProperty(p)
                  ? t.objectProperty(p.key, p.value, p.computed, p.shorthand, p.decorators)
                  : t.objectMethod(p.kind, p.key, p.params, p.body, p.computed)
              ))
            )
          ].concat(
            meta
          ).concat([
            id
          ]))
        );
      }
    }
  };

  return { visitor };
};
