//---------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------

module.exports = (meta) => {
  meta.for(Object).update({
    module: '(built-in)',
    platforms: ['ECMAScript'],
    name: 'Object'
  });

  meta.for(Object.prototype).update({
    module: '(built-in)',
    platforms: ['ECMAScript'],
    name: 'Object.prototype'
  });

  meta.for(Function).update({
    module: '(built-in)',
    platforms: ['ECMAScript'],
    name: 'Function.prototype'
  });

  meta.for(String).update({
    module: '(built-in)',
    platforms: ['ECMAScript'],
    name: 'String'
  });

  meta.for(String.prototype).update({
    module: '(built-in)',
    platforms: ['ECMAScript'],
    name: 'String.prototype'
  });

  meta.for(Number).update({
    module: '(built-in)',
    platforms: ['ECMAScript'],
    name: 'Number'
  });

  meta.for(Number.prototype).update({
    module: '(built-in)',
    platforms: ['ECMAScript'],
    name: 'Number.prototype'
  });

  meta.for(Boolean).update({
    module: '(built-in)',
    platforms: ['ECMAScript'],
    name: 'Boolean'
  });

  meta.for(Boolean.prototype).update({
    module: '(built-in)',
    platforms: ['ECMAScript'],
    name: 'Boolean.prototype'
  });

  meta.for(RegExp).update({
    module: '(built-in)',
    platforms: ['ECMAScript'],
    name: 'RegExp'
  });

  meta.for(RegExp.prototype).update({
    module: '(built-in)',
    platforms: ['ECMAScript'],
    name: 'RegExp.prototype'
  });

  meta.for(Date).update({
    module: '(built-in)',
    platforms: ['ECMAScript'],
    name: 'Date'
  });

  meta.for(Date.prototype).update({
    module: '(built-in)',
    platforms: ['ECMAScript'],
    name: 'Date.prototype'
  });

  meta.for(Array).update({
    module: '(built-in)',
    platforms: ['ECMAScript'],
    name: 'Array'
  });

  meta.for(Array.prototype).update({
    module: '(built-in)',
    platforms: ['ECMAScript'],
    name: 'Array.prototype'
  })
};
