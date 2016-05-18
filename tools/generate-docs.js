'use strict';

var fs = require('fs');
var path = require('path');
var metamagical = require('../packages/interface');
var generateTree = require('../packages/mkdocs')(metamagical).generateTree;
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

var data  = tree(metamagical, 'metamagical-interface', require('../packages/interface'), {
  skipUndocumented: true
});
var files = generateTree(data.tree, { references: data.references });

files.forEach(function(file) {
  console.log(': Generating', file.filename);
  write(p(file.filename), file.content);
});
