//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// -- DEPENDENCIES -----------------------------------------------------
const { data } = require('folktale/core/adt');


// -- ALIASES AND CONSTANTS ----------------------------------------------------------
const keys  = Object.keys;
const fills = [
  { fill: '*',  overline: true  },
  { fill: '=',  overline: false },
  { fill: '-',  overline: false },
  { fill: '~',  overline: false },
  { fill: '^',  overline: false },
  { fill: '\'', overline: false }
];


// -- HELPERS ----------------------------------------------------------
function repeat(text, times) {
  return Array.from(Array(times), () => text).join('');
}

function pad(text, spaces) {
  return `${repeat(' ', spaces)}${text}`;
}

function lines(text) {
  return text.split(/\r\n|\n\r|\r|\n/);
}

function entries(object) {
  return keys(object).map(key => [key, object[key]]);
}

function compactArray(array) {
  return array.filter(x => x != null);
}

function render(node) {
  return node.render();
}

function renderItem([key, value]) {
  if (!value) {
    return '';
  } else {
    return `:${key}: ${lines(value).join(' ')}`;
  }
}

function getTitle(title, level) {
  const { fill, overline } = fills[level];
  const line               = repeat(fill, title.length);

  if (overline) {
    return [Text(line), Text(title), Text(line)];
  } else {
    return [Text(title), Text(line)];
  }
}

// -- IMPLEMENTATION ---------------------------------------------------
const RST = data('metamagical:sphinx:rst', {
  Text(value) {
    return { value };
  },

  Sequence(values) {
    return { values };
  },

  Block(values, indent = 0) {
    return { values, indent };
  },

  Options(values) {
    return { values };
  },

  Directive(name, arg = '', options = null, content = Text('')) {
    return { name, arg, options, content };
  },

  Title(title, level = 0) {
    return { title, level };
  }
});

const { Text, Sequence, Block, Options, Directive, Title } = RST;

RST.render = function() {
  return this.cata({
    Text: ({ value }) =>
      value,

    Sequence: ({ values }) =>
      values.map(render).join(''),

    Block: ({ values, indent }) =>
      lines(values.map(render).join('\n'))
        .map(line => pad(line, indent))
        .join('\n'),

    Options: ({ values }) =>
      entries(values).map(renderItem)
                     .filter(x => x.trim() !== '')
                     .join('\n'),

    Directive: ({ name, arg, options, content }) =>
      Block([
        Sequence([
          Text('.. '), Text(name), Text(':: '), Text(arg)
        ]),
        Block(compactArray([
          options,
          Text(''), // Need a blank line between the two
          content,
          Text('')
        ]), 3)
      ]).render(),

    Title: ({ title, level }) =>
      Block([
        Text('')
      ].concat(getTitle(title, level)).concat([
        Text('')
      ])).render()
  });
};



module.exports = RST;
