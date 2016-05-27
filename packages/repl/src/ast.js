//---------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------

// --[ Dependencies ]--------------------------------------------------
const { data } = require('folktale/core/adt');


// --[ ADT Definition ]------------------------------------------------

/*~
 * The AST used by displays to present information.
 *
 * ---
 * isModule  : true
 * stability : experimental
 * category  : Representing output
 */
const AST = data('metamagical-browser:ADT', {

  // ---[ Base nodes ]-------------------------------------------------
  Nil() {
    return {};
  },

  Text(text) {
    return { text };
  },


  // ---[ Structure ]--------------------------------------------------
  Sequence(items) {
    return { items };
  },

  Block(indentation, items) {
    return { indentation, items };
  },

  Title(level, content) {
    return { level, content };
  },

  Subtitle(level, content) {
    return { level, content };
  },

  Quote(content) {
    return { content };
  },

  Code(language, source) {
    return { language, source };
  },

  List(items) {
    return { items };
  },

  Table(headings, rows) {
    return { headings, rows };
  },

  HorizontalLine(size = 72) {
    return { size };
  },

  // ---[ Inline formatting ]------------------------------------------
  Strong(content) {
    return { content };
  },

  Emphasis(content) {
    return { content };
  },

  Good(content) {
    return { content };
  },

  Error(content) {
    return { content };
  },

  Warning(content) {
    return { content };
  },

  Detail(content) {
    return { content };
  },

  Label(content) {
    return { content };
  },

  // TODO: this should be replaced by nodes in this ast, but we don't have a Markdown parser rn
  Markdown(text) {
    return { text };
  }

});


// --[ Exports ]-------------------------------------------------------
module.exports = AST;