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
const Browser = Refinable.refine({

  // ---[ State & Configuration ]--------------------------------------
  get metadata() {
    throw new Error('Unimplemented.');
  },

  get display() {
    return TerminalDisplay;
  },


  // ---[ Navigating in the browser ]----------------------------------
  for(meta) {
    return this.refine({ metadata: meta });
  },

  forProperty(name) {
    return this.metadata.property(name).map(x => this.for(x))
               .orElse(_ => { throw new Error(`No property for ${name}`) })
               .get();
  },

  forGetter(name) {
    return this.metadata.getter(name).map(x => this.for(x))
               .orElse(_ => { throw new Error(`No getter for ${name}`) })
               .get();
  },

  forSetter(name) {
    return this.metadata.setter(name).map(x => this.for(x))
               .orElse(_ => { throw new Error(`No setter for ${name}`) })
               .get();
  },

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

  summary() {
    return this.display.show(
      this._section(
        Text(this.getSignature()),
        Block(0, collapseNils([
          this.getMetadata('type').map(v => Code('mli', v)).getOrElse(null),
          Nil(),
          this.getMetadata('deprecated').map(deprecated).getOrElse(null),
          Nil(),
          this._executionMeta(),
          Nil(),
          this._synopsis().map(Text).getOrElse(null),
          Nil(),
          Quote(Text('(run `.documentation()` for the full docs)')),
          Nil(),
          Block(0, [
            Title(2, Text('Properties')),
            this._renderProperties(3, this.metadata.allProperties())
          ]),
          Nil(),
          HorizontalLine(),
          Nil(),
          this._generalMetadata()
        ].filter(x => x !== null)))
      )
    );
  },

});


// --[ Exports ]-------------------------------------------------------
module.exports = Browser;

