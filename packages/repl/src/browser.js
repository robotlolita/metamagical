//---------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------

// --[ Dependencies ]--------------------------------------------------
const Refinable       = require('refinable');
const marked          = require('marked');
const TerminalDisplay = require('./terminal-display');
const {
  Nil, Text,
  Sequence, Block, Title, Subtitle, Quote, Code, List, Table, HorizontalLine,
  Strong, Emphasis, Good, Error, Warning, Detail, Label,
  Markdown
} = require('./ast');


// --[ Helpers ]-------------------------------------------------------
function isNil(x) {
  return x && Nil.hasInstance(x);
}

function startsWith(prefix, text) {
  return text.indexOf(prefix) === 0;
}

function collapseNils(xs) {
  return xs.reduce((l, r) => {
    if (isNil(l[l.length - 1]) && isNil(r)) {
      return l;
    } else {
      return l.concat([r]);
    }
  }, []);
}

function ellipsis(max, text) {
  const x = text.trim();

  return x.length >= max ?  `${x.slice(0, max - 1)}…`
  :      /* else */         x
}

function definitionList(object) {
  return List(Object.keys(object).map(key =>
    Sequence([
      Label(Text(key)),
      Text(': '),
      Text(object[key])
    ])
  ));
}

function deprecated({ since, reason }) {
  return Quote(Block(0, [
    Error(Strong(Text(`Deprecated since ${since}`))),
    Nil(),
    Text(reason)
  ]));
}


// --[ The Browser ]---------------------------------------------------
/*~
 * The Meta:Magical browser allows inspecting annotated objects and
 * learning how to use them.
 *
 * The Browser is parameterised on an Interface, and a Display. The
 * Interface tells the Browser how to access metadata, whereas the
 * Display tells the Browser how to show that metadata.
 *
 * See the `State & Configuration` section for more details.
 *
 * ---
 * isModule  : true
 * stability : experimental
 * category  : Browsing Metadata
 */
const Browser = Refinable.refine({

  // ---[ State & Configuration ]--------------------------------------
  /*~
   * The metadata that should be displayed by this browser.
   *
   * This is an instance of `metamagical-interface`'s Interface, pointing
   * to the object that this browser should display. For example, in order
   * to see the summary of this Browser, one could refine it in the
   * following way:
   *
   *     const Interface = require('metamagical-interface');
   *     Browser.refine({ metadata: Interface.for(Browser) }).summary()
   *
   * It's better to use the `.for(Interface)` method of the Browser to
   * refine it than refine it directly, however:
   *
   *     Browser.for(Interface.for(Browser)).summary()
   *
   * ---
   * isRequired : true
   * category   : State & Configuration
   * stability  : experimental
   * type: |
   *   Interface
   */
  get metadata() {
    throw new Error('Unimplemented.');
  },

  /*~
   * How the metadata should be presented to the user.
   *
   * By default this Browser uses a Terminal display, which shows the
   * data with some formatting using terminal escape characters.
   *
   * Any other display may be provided, however, and this can be used
   * for generating static documentation, for example, by providing a
   * display that computes HTML or Markdown, instead of outputing it
   * to the screen.
   *
   * A display is a type that has a single method, `show(tree)`, which
   * takes a tree from a Browser AST, and returns the result of showing
   * that tree. In essence, Displays must fulfil the following interface:
   *
   *     type Display = {
   *       show : (BrowserAST) => Any
   *     }
   *
   * Since the Terminal display just outputs it on the terminal, it just
   * returns undefined. The Browser itself does nothing with the result,
   * it only returns it. So your Display could also return richer data
   * than a String, if it makes post-processing easier.
   *
   * In order to provide a Display to the browser, it has to be refined:
   *
   *     const HTMLBrowser = Browser.refine({ display: HTMLDisplay });
   *
   * ---
   * category  : State & Configuration
   * stability : experimental
   * type: |
   *   { show : (BrowserAST) => Any }
   */
  get display() {
    return TerminalDisplay;
  },


  // ---[ Navigating in the browser ]----------------------------------
  /*~
   * Changes the Interface for metadata this browser is showing.
   *
   * This should be an instane of `metamagical-interface`'s Interface
   * pointing to the object this browser should display. See `metadata`
   * for more information.
   *
   * Example:
   *
   *     const Interface = require('metamagical-interface');
   *     const browserBrowser = Browser.for(Interface.for(Browser));
   *
   * ---
   * category  : Navigating in the browser
   * stability : experimental
   * type: |
   *   Browser.(Interface) => Browser
   */
  for(meta) {
    return this.refine({ metadata: meta });
  },

  /*~
   * Browses the object at the given property of the current object.
   *
   * Example:
   *
   *     const forPropertyBrowser = Browser.forProperty("forProperty");
   *
   * ---
   * category  : Navigating in the browser
   * stability : experimental
   *
   * throws:
   *   Error: when the property doesn't exist in the object.
   *
   * type: |
   *   Browser.(String) => Browser :: (throws Error)
   */
  forProperty(name) {
    return this.metadata.property(name).map(x => this.for(x))
               .orElse(_ => { throw new Error(`No property for ${name}`) })
               .get();
  },

  /*~
   * Browses the getter with the given name in the current object.
   *
   * Example:
   *
   *     const newBrowser = Browser.forGetter("metadata");
   *
   * ---
   * category  : Navigating in the browser
   * stability : experimental
   *
   * throws:
   *   Error: when the getter doesn't exist in the object.
   *
   * type: |
   *   Browser.(String) => Browser :: (throws Error)
   */
  forGetter(name) {
    return this.metadata.getter(name).map(x => this.for(x))
               .orElse(_ => { throw new Error(`No getter for ${name}`) })
               .get();
  },

  /*~
   * Browses the setter with the given name in the current object.
   *
   * Example:
   *
   *     let foo = {
   *       _x: 0,
   *       set x(value) { this._x = value }
   *     };
   *     const newBrowser = Browser.for(Interface.for(foo))
   *                               .forSetter("x");
   *
   * ---
   * category  : Navigating in the browser
   * stability : experimental
   *
   * throws:
   *   Error: when the setter doesn't exist in the object.
   *
   * type: |
   *   Browser.(String) => Browser :: (throws Error)
   */
  forSetter(name) {
    return this.metadata.setter(name).map(x => this.for(x))
               .orElse(_ => { throw new Error(`No setter for ${name}`) })
               .get();
  },

  /*~
   * Browses the prototype of the current object.
   *
   * Example:
   *
   *     const newBrowser = Browser.forPrototype();
   *
   * ---
   * category  : Navigating in the browser
   * stability : experimental
   *
   * throws:
   *   Error: when the object doesn't have a `[[Prototype]]`
   *
   * type: |
   *   Browser.() => Browser :: (throws Error)
   */
  forPrototype() {
    return this.metadata.prototype().map(x => this.for(x))
               .orElse(_ => { throw new Error('No prototype') })
               .get();
  },

  // ---[ Auxiliary operations ]---------------------------------------
  getMetadata(name) {
    return this.metadata.get(this.metadata.fields[name]);
  },

  getSignature() {
    return this.getMetadata('signature')
               .orElse(_ => this.getMetadata('name'))
               .getOrElse('(Anonymous)');
  },

  _section(title, content) {
    return Block(0, [
      Title(1, title),
      Nil(),
      content
    ]);
  },

  _hierarchy() {
    const hierarchy = this.metadata.hierarchy();
    const parents   = this.metadata.parents();

    if (parents.length > 0) {
      return Sequence([
        Label(Text('Hierarchy:')),
        Text(' '),
        Emphasis(Text(`(${parents.length} parent${parents.length > 0 ? 's' : ''})`)),
        Text(' '),
        Text(hierarchy.map(([name, _]) => name).join(' → '))
      ]);
    } else {
      return Nil();
    }
  },

  _synopsis() {
    return this.getMetadata('documentation').map(doc => {
      const maybeParagraph = marked.lexer(doc)[0];
      if (maybeParagraph && maybeParagraph.type === 'paragraph') {
        return maybeParagraph.text;
      } else {
        return '(No synopsis)';
      }
    });
  },

  _partialDocs() {
    return this.getMetadata('documentation').map(doc => {
      const lines = doc.split(/\r\n|\n\r|\r|\n/).reduce(({ items, take }, line) => {
        if (!take) {
          return { items, take };
        } else {
          if (/^#+\s(?!example:?:?)/i.test(line)) {
            return { items, take: false };
          } else {
            return { items: [...items, line], take };
          }
        }
      }, { items: [], take: true }).items;

      if (lines.length > 0) {
        return lines.join('\n');
      } else {
        return '(No synopsis)';
      }
    });
  },

  _withSignature(prefix) {
    return Sequence([
      Text(prefix),
      Text(' '),
      Text(this.getSignature())
    ]);
  },

  _maybeDefinition(label, content) {
    return content.cata({
      Nothing: _ => Nil(),
      Just:    v => Sequence([
        Label(Text(label)),
        Text(' '),
        v
      ])
    });
  },

  _stabilityFormat: {
    deprecated:   Error,
    experimental: Warning,
    stable:       Good,
    locked:       Good
  },

  _location() {
    return this.getMetadata('location').map(loc => {
      return Text([
        loc.filename ? loc.filename : '',
        loc.start    ? `at line ${loc.start.line}, column ${loc.start.column}` : null
      ].filter(x => x !== null).join(' '));
    });
  },

  _stabilitySummary() {
    return this.getMetadata('stability').map(s => {
      const format = this._stabilityFormat[s];
      const stability = this.metadata.Stability.fromIdentifier(s);

      return format(Text(`${stability.index} - ${stability.name}`));
    });
  },

  _executionMeta() {
    return Block(0, [
      this._maybeDefinition('Stability:', this._stabilitySummary()),
      this._maybeDefinition('Platforms:', this.getMetadata('platforms').map(xs => List(xs.map(Text)))),
      this._maybeDefinition('Complexity:', this.getMetadata('complexity').map(Text)),
      this._maybeDefinition('Returns:', this.getMetadata('returns').map(Text)),
      this._maybeDefinition('Throws:', this.getMetadata('throws').map(definitionList)),
      this._maybeDefinition('Parameters:', this.getMetadata('parameters').map(definitionList))
    ].filter(x => !isNil(x)));
  },

  _generalMetadata() {
    return Block(0, [
      this._maybeDefinition('Available since:', this.getMetadata('since').map(Text)),
      this._maybeDefinition('From:', this._location()),
      this._maybeDefinition('In package:', this.getMetadata('npmPackage').map(Text)),
      this._maybeDefinition('In module:', this.getMetadata('module').map(Text)),
      this._maybeDefinition('In object:', this.getMetadata('belongsTo').map(f =>
        Text(this.for(this.metadata.for(f())).getSignature())
      )),
      Text(''),
      this._maybeDefinition('Portability:', this.getMetadata('portable').map(v =>
        Text(v ? 'portable' : 'not portable')
      )),
      this._maybeDefinition('Copyright:', this.getMetadata('copyright').map(Text)),
      this._maybeDefinition('Licence:', this.getMetadata('licence').map(Text)),
      this._maybeDefinition('Repository:', this.getMetadata('repository').map(Text)),
      this._maybeDefinition('Web Site:', this.getMetadata('homepage').map(Text)),
      Text(''),
      this._maybeDefinition('Authors:', this.getMetadata('authors').map(xs => List(xs.map(Text)))),
      this._maybeDefinition('Maintainers:', this.getMetadata('maintainers').map(xs => List(xs.map(Text)))),
    ].filter(x => !isNil(x)));
  },

  _renderProperties(level, properties) {
    return Block(0,
      properties.map(({ category, members }) => {
        return Block(0, [
          Nil(),
          Title(level, Text(category)),
          List(members.map(member => {
            const meta      = this.metadata.for(member.value);
            const suffix    = meta.getByName('isRequired').map(v =>
                                true ? Error(Text(' (required, but missing)')) : Nil()
                              ).getOrElse(Nil());
            const signature = meta.get(meta.fields.signature).getOrElse(member.name)
                                  .replace(/^(get|set) /, '');
            const modifier  = member.kind === 'getter' ? 'get '
                            : member.kind === 'setter' ? 'set '
                            : /* otherwise */            '';
            const prefix    = startsWith(member.name, signature) ? Nil() : Text(`${member.name}: `);
            const synopsis  = ellipsis(120, this.for(meta)._synopsis().getOrElse('(No documentation)'));

            return Block(0, [
              Sequence([Text(modifier), Strong(prefix), Strong(Text(signature)), suffix]),
              Detail(Sequence([Text('   | '), Text(synopsis)])),
              Nil()
            ]);
          }))
        ]);
      })
    );
  },



  // ---[ Inspecting metadata ]----------------------------------------

  /*~
   * Shows the full documentation of the current object.
   *
   * ---
   * category  : Inspecting metadata
   * stability : experimental
   * type: |
   *   Browser.() => Any
   */
  documentation() {
    return this.display.show(
      this._section(
        this._withSignature('Documentation for'),
        Markdown(
          this.getMetadata('documentation').getOrElse('(No documentation)')
        )
      )
    );
  },

  /*~
   * Shows the source code of the current object.
   *
   * ---
   * category  : Inspecting metadata
   * stability : experimental
   * type: |
   *   Browser.() => Any
   */
  source() {
    return this.getMetadata('source').map(source =>
      this.display.show(
        this._section(
          this._withSignature('Source for'),
          Block(0, [
            ...[
              this._maybeDefinition('From:', this._location()),
              this._maybeDefinition('NPM package:', this.getMetadata('npmPackage').map(Text)),
              this._maybeDefinition('In module:', this.getMetadata('module').map(Text)),
              this._maybeDefinition('In object:', this.getMetadata('belongsTo').map(f =>
                Text(this.for(this.metadata.for(f())).getSignature())
              ))
            ].filter(v => !Nil.hasInstance(v)),
            Nil(),
            Code('javascript', source)
          ])
        )
      )
    ).getOrElse(undefined);
  },

  /*~
   * Shows the stability of the current object.
   *
   * ---
   * category  : Inspecting metadata
   * stability : experimental
   * type: |
   *   Browser.() => Any
   */
  stability() {
    return this.getMetadata('stability').map(id => {
      const stability = this.metadata.Stability.fromIdentifier(id);
      const format = this._stabilityFormat[id];

      return this.display.show(
        this._section(
          this._withSignature('Stability for'),
          Block(0, [
            Strong(format(Text(`${stability.index} - ${stability.name}`))),
            Nil(),
            Markdown(stability.description)
          ])
        )
      );
    }).getOrElse(undefined);
  },

  /*~
   * Shows a summary of the current object, with signature, synopsis, and
   * properties.
   *
   * ---
   * category  : Inspecting metadata
   * stability : experimental
   * type: |
   *   Browser.() => Any
   */
  summary() {
    return this.display.show(
      this._section(
        Text(this.getSignature()),
        Block(0, collapseNils([
          this.getMetadata('type').map(v => Code('mli', v)).getOrElse(null),
          Nil(),
          this.getMetadata('deprecated').map(deprecated).getOrElse(null),
          Nil(),
          this._hierarchy(),
          this._executionMeta(),
          Nil(),
          this._partialDocs().map(Markdown).getOrElse(null),
          Nil(),
          Quote(Text('(run `.documentation()` for the full docs)')),
          Nil(),
          Block(0, [
            Title(2, Text('Properties')),
            this._renderProperties(3, this.metadata.properties())
          ]),
        ].filter(x => x !== null)))
      )
    );
  },


  /*~
   * Shows all properties that are accessible from the object.
   * 
   * ---
   * category  : Inspecting metadata
   * stability : experimental
   * type: |
   *   Browser.() => Any
   */
  properties() {
    return this.display.show(
      this._section(
        Text(`Properties accessible from ${this.getSignature()}`),
        this._renderProperties(2, this.metadata.allProperties())
      )
    );
  }

});


// --[ Exports ]-------------------------------------------------------
module.exports = Browser;

