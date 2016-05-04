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
const { parse } = require('babylon');


// -- HELPERS ---------------------------------------------------------

/*~
 * A template for creating an assertion AST.
 */
const buildAssertion = template(`
  require(MODULE).deepStrictEqual(ACTUAL, EXPECTED, MESSAGE)
`);


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


/*~
 * Parses an assertion expectation into a proper JavaScript expression.
 */
function parseAssertion(source) {
  const data = source.replace(/^\s*==>\s*/, '').trim();

  try {
    const ast = parse(data).program.body;
    if (ast.length !== 1 && ast[0].type !== 'ExpressionStatement') {
      throw new TypeError(`Expected a single expression in ${data}`);
    }

    return {
      expression: ast[0].expression,
      source: data
    };
  } catch (e) {
    return null;
  }
}


/*~
 * Maybe retrieves an assertion comment for the given node.
 */
function getTrailingAssertion(node) {
  const comment = first(node.trailingComments || []);

  return comment && isAssertion(comment) ?  parseAssertion(comment.value)
  :      /* otherwise */                    null;
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
 * That is, the following example:
 *
 *     2 * 2  // ==> 4
 *
 * Gets compiled to:
 *
 *     require('assert').deepStrictEqual(2 * 2, 4, '2 * 2 ==> 4')
 *
 * Only strict assertion comments are supported right now.
 *
 *
 * ## Options
 *
 * You can configure which assertion module is used by providing the
 * `module` option to Babel. By default this transform uses Node's
 * built-in `assert` module.
 */
module.exports = function({ types: t }) {
  return {
    visitor: {
      ExpressionStatement(path, state) {
        const assertModule = state.opts.module || 'assert';
        const assertion    = getTrailingAssertion(path.node);

        if (assertion) {
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
