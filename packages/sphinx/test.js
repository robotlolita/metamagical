require('babel-polyfill');
var s = require('./')(require('../interface'));
var d = require('folktale/core/adt').data;

function show(p) {
  p.then(
    v => console.log(v.content),
    e => console.log('ERROR:\n', e, '\n', e.stack)
  )
}

show(s.generateOne(d))
