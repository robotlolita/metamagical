//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const generate  = require("babel-generator").default;
const template  = require("babel-template");
const { parse } = require("babylon");


const buildAssertion = template(`
  require(MODULE).deepStrictEqual(ACTUAL, EXPECTED, MESSAGE)
`)

function first(xs) {
  return xs[0];
}

function isAssertion(comment) {
  return comment.type === 'CommentLine'
  &&     /^\s*==>\s*.+$/.test(comment.value);
}

function parseAssertion(source) {
  const data = source.replace(/^\s*==>\s*/, '').trim();
  
  try {
    const ast = parse(data).program.body;
    if (ast.length !== 1 && ast[0].type !== "ExpressionStatement") {
      throw new TypeError("Expected a single expression in " + data);
    }
    
    return {
      expression : ast[0].expression,
      source     : data
    }
  } catch(e) {
    return null;
  }
}

function getTrailingAssertion(node) {
  const comment = first(node.trailingComments || []);
  
  return comment && isAssertion(comment) ?  parseAssertion(comment.value)
  :      /* otherwise */                    null
}


module.exports = function({ types: t }) {
  return {
    visitor: {
      ExpressionStatement(path, state) {
        const assertModule = state.opts.module || "assert";
        const assertion    = getTrailingAssertion(path.node);
        
        if (assertion) {
          path.node.expression = buildAssertion({
            MODULE   : t.stringLiteral(assertModule),
            ACTUAL   : path.node.expression,
            EXPECTED : assertion.expression,
            MESSAGE  : t.stringLiteral(generate(path.node.expression).code + " ==> " + assertion.source)
          });
        }
      }
    }
  }
};
