//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var called = false;

const metamagical = require('../../../interface');
const defineTests = require('../../')(metamagical, describe, it);
const assert = require('assert');

function double(n) {
  return n + n;
}

double[Symbol.for('@@meta:magical')] = {
  name: 'double',
  examples: [_ => {
    assert(double(10) === 20);
    assert(double(15) === 30);
    called = true;
  }]
}

defineTests(double);

describe('Mocha-Bridge', () => {
  it('Examples were called', () => {
    assert(called);
  })
});
