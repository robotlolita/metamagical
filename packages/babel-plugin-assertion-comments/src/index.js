//---------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------

// -- DEPENDENCIES ----------------------------------------------------
const generate  = require('babel-generator').default;
const template  = require('babel-template');
const traverse  = require('babel-traverse').default;
const { parse } = require('babylon');


// -- HELPERS ---------------------------------------------------------

/*~
 * A template for creating an assertion AST.
 */
const buildAssertion = template(`
  __metamagical_assert_equals(require(MODULE), ACTUAL, EXPECTED, MESSAGE)
`);


/*~
 * The deep equality function.
 */
function assertEquals(assert, actual, expected, message) {
  const assertionType = Symbol.for('@@meta:magical:assertion-type');
  const rest          = Symbol.for('@@meta:magical:assertion-rest');
  const keys          = Object.keys;

  function isSetoid(value) {
    return value
    &&     typeof value.equals === 'function';
  }

  function isRecord(value) {
    return value
    &&     value[assertionType] === 'record';
  }

  function check(predicate, ...values) {
    return values.every(predicate);
  }

  function getSpecialArrayLength(array) {
    const rests = array.map((x, i) => [x, i]).filter(pair => pair[0] === rest);
    if (rests.length > 1 || (rests[0] && rests[0][1] !== array.length - 1)) {
      assert.ok(false, message);
    }
    return (rests[0] || [null, array.length])[1];
  }

  function compareArrays(left, right) {
    const expectedLength = getSpecialArrayLength(right);
    assert.ok(Array.isArray(left), message);
    if (left.length < expectedLength) {
      assert.ok(false, message);
    }
    for (let i = 0; i < expectedLength; ++i) {
      compare(left[i], right[i]);
    }
  }

  function compareRecord(left, right) {
    const isPartial = right[rest];
    assert.ok(Object(left) === left, message);
    if (!isPartial) {
      assert.deepStrictEqual(keys(left).sort(), keys(right).sort(), message);
    }
    Object.keys(right).forEach(key => {
      if (!(key in left)) {
        assert.ok(false, message);
      }
      compare(left[key], right[key]);
    });
  }


  function compare(l, r) {
    return check(isSetoid, l, r)  ?  assert.ok(l.equals(r), message)
    :      Array.isArray(r)       ?  compareArrays(l, r)
    :      isRecord(r)            ?  compareRecord(l, r)
    :      /* otherwise */           assert.deepStrictEqual(l, r, message);
  }

  compare(actual, expected);
}


/*~
 * Returns the first item of an array.
 */
function first(xs) {
  return xs[0];
}


/*~
 * Tests if a comment node in the AST is an assertion comment.
 */
function isAssertion(comment) {
  return comment.type === 'CommentLine'
  &&     /^\s*==>\s*.+$/.test(comment.value);
}


// -- IMPLEMENTATION --------------------------------------------------
/*~
 * A Babel transformer that converts assertion comments into runtime
 * assertions.
 *
 * Assertion comments are usually used in examples to show readers
 * what a particular expression evaluates to, but they don't get
 * checked when one runs the code. This plugin allows people to write
 * assertion comments after a particular expression. It then transforms
 * this assertion comment into a real runtime assertion.
 *
 *     2 * 2  // ==> 4
 *
 *
 * ## Options
 *
 * You can configure which assertion module is used by providing the
 * `module` option to Babel. By default this transform uses Node's
 * built-in `assert` module.
 */
module.exports = function({ types: t }) {
  const assertEqualsFD = parse(assertEquals.toString()).program.body[0];
  const assertEqualsAST = t.functionExpression(
    t.identifier('metamagical_assert_equals'),
    assertEqualsFD.params,
    assertEqualsFD.body
  );

  function makeSymbol(name) {
    return t.callExpression(
      t.memberExpression(
        t.identifier('Symbol'),
        t.identifier('for')
      ),
      [t.stringLiteral(name)]
    );
  }

  function makeRest() {
    return makeSymbol('@@meta:magical:assertion-rest');
  }

  function makeAssertionType() {
    return makeSymbol('@@meta:magical:assertion-type');
  }

  function transformSpread(ast) {
    traverse(ast, {
      enter(path) {
        switch (path.node.type) {
          case 'SpreadElement':
            if (path.node.argument.name === "_") {
              path.replaceWith(makeRest());
            }
            break;

          case 'ObjectExpression':
            path.node.properties.push(
              t.objectProperty(makeAssertionType(), t.stringLiteral('record'), true)
            );
            break;

          case 'SpreadProperty':
            if (path.node.argument.name === "_") {
              path.replaceWith(t.objectProperty(makeRest(), t.booleanLiteral(true), true));
            }
            break;
        }
      }
    });
    return ast;
  }


  function parseAssertion(source) {
    const data = source.replace(/^\s*==>\s*/, '').trim();

    try {
      let ast = parse(`(${data})`, { plugins: ['objectRestSpread'] });
      transformSpread(ast);
      ast = ast.program.body;
      if (ast.length !== 1 && ast[0].type !== 'ExpressionStatement') {
        throw new TypeError(`Expected a single expression in ${data}`);
      }

      return {
        expression: ast[0].expression,
        source: data
      };
    } catch (e) {
      console.log('Error parsing ' + source + ': ', e);
      return null;
    }
  }


  function getTrailingAssertion(node) {
    const comment = first(node.trailingComments || []);

    return comment && isAssertion(comment) ?  parseAssertion(comment.value)
    :      /* otherwise */                    null;
  }


  return {
    visitor: {
      ExpressionStatement(path, state) {
        const assertModule = state.opts.module || 'assert';
        const assertion    = getTrailingAssertion(path.node);

        if (assertion) {
          if (!path.hub.file.scope.hasBinding('__metamagical_assert_equals')) {
            path.hub.file.scope.push({
              id: t.identifier('__metamagical_assert_equals'),
              init: assertEqualsAST
            });
          }

          path.node.expression = buildAssertion({
            MODULE:   t.stringLiteral(assertModule),
            ACTUAL:   path.node.expression,
            EXPECTED: assertion.expression,
            MESSAGE:  t.stringLiteral(`${generate(path.node.expression).code} ==> ${assertion.source}`)
          });
        }
      }
    }
  };
};
