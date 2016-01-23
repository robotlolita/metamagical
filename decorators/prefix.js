//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// Copyright (C) 2016 Quildreen Motta.
// Licensed under the MIT licence.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// # module: metamagical/decorators/prefix
//
// This module provides decorators that can be used to attach common
// meta-data to objects. These are intended to be used primarily with
// ES2016 (ES7) decorators, however they can be also used as regular
// functions.

var metaSymbol = Symbol.for('@@meta:magical');


// -- Dependencies -----------------------------------------------------
var assertObject = require('./assertions').assertObject;


// -- Aliases ----------------------------------------------------------
var hasOwnProperty = Object.prototype.hasOwnProperty;
var isExtensible = Object.isExtensible;
var isFrozen = Object.isFrozen;


// -- Helpers ----------------------------------------------------------

// ### function: withMeta(fn, meta)
//
// Updates a function with some meta-magical metadata.
function withMeta(fn, meta) {
  fn[metaSymbol] = meta;
  return fn;
}

// ### function: set(attribute)(value)(object)
//
// A curried function for setting particular pieces of meta-data.
function set(attribute) {
  return function(value) {
    return function(object) {
      assertObject(object);

      if (!(hasOwnProperty.call(object, metaSymbol))) {
        if (!isExtensible(object)) {
          throw new Error(
            "The object doesn't have a `@@meta:magical` property, and "
          + "isn't extensible, so Meta:Magical can't add that property "
          + "for you. If you want to decorate restricted objects with meta-data, "
          + "you need to provide a `@@meta:magical` property yourself."
          + "\n\n"
          + "Example:\n"
          + "    var obj = { };"
          + "    obj[Symbol.for('@@meta:magical')] = {};"
          + "    Object.freeze(obj);"
          + "    documentation('The docs')(obj);"
          );
        }
        object[metaSymbol] = {};
      }

      var meta = object[metaSymbol];
      if (!isExtensible(meta) || isFrozen(meta)) {
        throw new Error(
          "The object provides a `@@meta:magical` property, but the "
        + "object that is its value is not extensible or frozen, so "
        + "Meta:Magical can't change its meta-data. This might have "
        + "been a result of a deep-freeze/seal."
        + "\n\n"
        + "Either make sure `@@meta:magical` in your object isn't "
        + "restricted to changes, or use the `metamagical/interface` "
        + "module directly to attach meta-data. Note that the interface"
        + "uses a global WeakMap to store meta-data, so you'll want to"
        + "make sure you only have a single instance of it in your"
        + "program.");
      }

      meta[attribute] = value;
    };
  };
}


// -- Exports ----------------------------------------------------------
module.exports = {
  name: withMeta(set('name'), {
    name: 'name',
    signature: 'name(name)',
    type: '(String) -> (Object) -> Void',
    category: 'Decorators',
    documentation: 'Describes the name of an object.'
  }),

  signature: withMeta(set('signature'), {
    name: 'signature',
    signature: 'signature(signature)',
    type: '(String) -> (Object) -> Void',
    category: 'Decorators',
    documentation: 'Describes the signature of a function.'
  }),

  type: withMeta(set('type'), {
    name: 'type',
    signature: 'type(type)',
    type: '(String) -> (Object) -> Void',
    category: 'Decorators',
    documentation: 'Describes the type of an object.'
  }),

  category: withMeta(set('category'), {
    name: 'category',
    signature: 'category(name)',
    type: '(String) -> (Object) -> Void',
    category: 'Decorators',
    documentation: 'Describes the category of an object.\n\n'
                 + 'Categories are used mainly when inspecting an object, '
                 + 'to separate the properties in logical groups that are '
                 + 'easier to understand.'
  }),

  tags: withMeta(set('tags'), {
    name: 'tags',
    signature: 'tags(tags)',
    type: '(Array<String>) -> (Object) -> Void',
    category: 'Decorators',
    documentation: 'Describes topics generally associated with the object.\n\n'
                 + 'Tags can be used for searching objects for particular '
                 + 'functionalities or topics. They provide a kind of '
                 + 'categorisation that is more flexible than `category`.'
  }),

  documentation: withMeta(set('documentation'), {
    name: 'documentation',
    signature: 'documentation(text)',
    type: '(String) -> (Object) -> Void',
    category: 'Decorators',
    documentation: 'Describes what the object is, and why it exists.\n\n'
                 + 'Documentation should consist of a short summary, not '
                 + 'much larger than 70 characters, followed by markdown-'
                 + 'formatted text that describes what the object is, and '
                 + 'why it exists, such that the user may figure out if '
                 + 'they should use it or not.'
  }),

  complexity: withMeta(set('complexity'), {
    name: 'complexity',
    signature: 'complexity(o)',
    type: '(String) -> (Object) -> Void',
    category: 'Decorators',
    documentation: 'Describes the complexity of a function.\n\n'
                 + 'All non-trivial functions should have a complexity '
                 + 'meta-data attached to them. This makes it easier for '
                 + 'people to compare different solutions in terms of '
                 + 'algorithmic performance.'
  }),

  portability: withMeta(set('portability'), {
    name: 'portability',
    signature: 'portability(string)',
    type: '(String) -> (Object) -> Void',
    category: 'Decorators',
    documentation: 'Describes whether the functionality is portable or not.\n\n'
                 + 'If not portable, you should generally attach a description '
                 + 'of which non-portable things it depends on.'
  }),

  stability: withMeta(set('stability'), {
    name: 'stability',
    signature: 'stability(string)',
    type: '(String) -> (Object) -> Void',
    category: 'Decorators',
    documentation: 'Describes how likely it is for the functionality to change.\n\n'
                 + 'The stability meta-data uses Node’s stability index:\n'
                 + '  * `deprecated` - The feature will be removed/redesigned.\n'
                 + '  * `experimental` - The feature is likely to change.\n'
                 + '  * `stable` - The feature is unlikely to change.\n'
                 + '    Backwards compatibility should be expected.\n'
                 + '  * `locked` - The feature will not change, but security\n'
                 + '    fixes can still be released.'
  }),

  seeAlso: withMeta(set('seeAlso'), {
    name: 'seeAlso',
    signature: 'seeAlso(thing)',
    type: '(String) -> (Object) -> Void',
    category: 'Decorators',
    documentation: 'Describes related functionality.'
  }),

  platforms: withMeta(set('platforms'), {
    name: 'platforms',
    signature: 'platforms(platforms)',
    type: '(Array<String>) -> (Object) -> Void',
    category: 'Decorators',
    documentation: 'Describes which platforms this functionality supports.'
  }),

  since: withMeta(set('since'), {
    name: 'since',
    signature: 'since(version)',
    type: '(String) -> (Object) -> Void',
    category: 'Decorators',
    documentation: 'Describes which version introduced this functionality.'
  }),

  deprecated: withMeta(set('deprecated'), {
    name: 'deprecated',
    signature: 'deprecated(reason)',
    type: '(String) -> (Object) -> Void',
    category: 'Decorators',
    documentation: 'Describes why the functionality has been deprecated.\n\n'
                 + 'Ideally you should also include how the user should '
                 + 'get the same functionality, and how they should fix '
                 + 'their code using the deprecated feature.'
  }),

  licence: withMeta(set('licence'), {
    name: 'licence',
    signature: 'licence(licence)',
    type: '(String) -> (Object) -> Void',
    category: 'Decorators',
    documentation: 'Describes the licence under which the functionality is released.'
  }),

  authors: withMeta(set('authors'), {
    name: 'authors',
    signature: 'authors(authors)',
    type: '(Array<String>) -> (Object) -> Void',
    category: 'Decorators',
    documentation: 'Describes the authors of the functionality.'
  })
};
