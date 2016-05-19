//---------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------

// --[ Dependencies ]--------------------------------------------------
const AST            = require('./ast');
const Refinable      = require('refinable');
const chalk          = require('chalk');
const marked         = require('marked');
const MarkedTerminal = require('marked-terminal');


// ---[ Initialisation ]-----------------------------------------------
marked.setOptions({
  renderer: new MarkedTerminal({
    reflowText: true,
    width: 72
  })
});


// --[ Helpers ]-------------------------------------------------------
function lines(text) {
  return text.split(/\r\n|\n\r|\n|\r/);
}

function repeat(string, times) {
  return Array(times + 1).join(string);
}

function indent(indentation, text) {
  return `${repeat(' ', indentation)}${text}`;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(n, max));
}

// --[ The renderer ]--------------------------------------------------
const TerminalDisplay = Refinable.refine({
  formatting: {
    title: [
      (title) => chalk.green.bold([title, repeat('=', title.length)].join('\n')),
      (title) => chalk.bold([title, repeat('-', title.length)].join('\n')),
      chalk.green
    ],

    subtitle: [
      chalk.bold
    ],

    quote: chalk.grey.italic,
    code: chalk.yellow,
    strong: chalk.bold,
    emphasis: chalk.italic,
    good: chalk.green,
    error: chalk.red,
    warning: chalk.red.bold,
    detail: chalk.grey,
    label: chalk.bold,

    markdown: marked
  },

  formattingForLevel(type, level) {
    const levels = this.formatting[type];
    return levels[clamp(level - 1, 0, levels.length - 1)];
  },

  render(tree) {
    return tree.cata({
      Nil:  _          => '',
      Text: ({ text }) => text,

      Sequence: ({ items }) =>
        items.map(x => this.render(x)).join(''),

      Block: ({ indentation, items }) =>
        lines(items.map(v => this.render(v)).join('\n'))
          .map(line => indent(indentation, line))
          .join('\n'),

      Title: ({ level, content }) =>
        this.formattingForLevel('title', level)([
          repeat('#', level),
          ' ',
          this.render(content)
        ].join('')),

      Subtitle: ({ level, content }) =>
        this.formattingForLevel('subtitle', level)(
          this.render(content)
        ),

      Quote: ({ content }) =>
        this.formatting.quote(
          lines(this.render(content)).map(line => `> ${line}`)
                                     .join('\n')
        ),

      Code: ({ language, startAt=1, source }) =>
        this.formatting.code(
            lines(source.trimRight())
              .map(line => indent(4, line))
              .join('\n')
        ),

      List: ({ items }) =>
        '\n' + items.map(item => {
          const [first, ...rest] = lines(this.render(item));
          return [
            `    • ${first}`,
            ...rest.map(line => indent(3, line))
          ].join('\n')
        }).join('\n'),

      Table: ({ headings, rows }) =>
        '(Tables are not implemented yet.)',

      HorizontalLine: ({ size }) =>
        repeat('-', size),


      Strong: ({ content }) =>
        this.formatting.strong(this.render(content)),

      Emphasis: ({ content }) =>
        this.formatting.emphasis(this.render(content)),

      Good: ({ content }) =>
        this.formatting.good(this.render(content)),

      Error: ({ content }) =>
        this.formatting.error(this.render(content)),

      Warning: ({ content }) =>
        this.formatting.warning(this.render(content)),

      Detail: ({ content }) =>
        this.formatting.detail(this.render(content)),

      Label: ({ content }) =>
        this.formatting.label(this.render(content)),

      Markdown: ({ text }) =>
        this.formatting.markdown(text.trimRight()).trim()
    });
  },

  show(tree) {
    console.log(this.render(tree));
  }
});


// --[ Exports ]-------------------------------------------------------
module.exports = TerminalDisplay;
