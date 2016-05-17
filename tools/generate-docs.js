'use strict';

var fs = require('fs');
var path = require('path');
var metamagical = require('metamagical-interface');
var generate = require('metamagical-mkdocs')(metamagical).generate;
var tree = require('../packages/static-tree');

var root = path.join(__dirname, '../documentation/docs');


function exists(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch (e) {
    return false;
  }
}

function mkdir(path) {
  if (!exists(path)) {
    console.log('Creating directory', path);
    fs.mkdirSync(path);
  }
}

function mkdirp(pathString) {
  if (!exists(pathString)) {
    var parent = path.join(pathString, '..');
    if (!exists(parent)) {
      mkdirp(parent);
    }
    mkdir(pathString);
  }
}

function write(pathString, data) {
  mkdirp(path.dirname(pathString));
  fs.writeFileSync(pathString, data, 'utf8');
}

function p(pathString) {
  return path.resolve(root, pathString);
}

function captureReferences(object) {
  return new Set(Object.keys(object)
                       .map(k => object[k].reference)
                       .filter(Boolean))
}

function generateTree(objects, path) {
  path = path || [];
  Object.keys(objects).forEach(key => {
    var value = objects[key];
    if (value.object) {
      console.log(': Generating ' + p(path.concat(key + '.md').join('/')) + '...');
      var data = generate(value.object, {
        linkPrefix: key + '/',
        skipUndocumented: true,
        skipDetailedPage: captureReferences(value.children),
        excludePrototypes: new Set([Array.prototype, Object.prototype, Function.prototype])
      });
      write(p(path.concat(key + '.md').join('/')), data);
    }
    generateTree(value.children || {}, path.concat(key));
  });
}


generateTree(tree(metamagical, 'metamagical-interface', require('../packages/interface'), {}));
