//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]--------------------------------------------------
const marked = require('marked');


module.exports = function(meta) {
  const f = meta.fields;

  // ---[ Helpers ]----------------------------------------------------
  function compact(object) {
    let result = {};

    Object.keys(object).forEach(key => {
      const value = object[key];
      if (!value.isNothing) {
        result[key] = value.get();
      }
    });

    return result;
  }

  function lines(text) {
    return text.split(/\r\n|\n\r|\r|\n/);
  }

  function entries(object) {
    return Object.keys(object)
                 .map(k => [k, object[k]]);
  }

  function repeat(text, times) {
    return Array(times + 1).join(text);
  }

  function title(text, level = 1) {
    return `\n${repeat('#', level)} ${text}\n`;
  }

  function para(text) {
    return block(lines(text));
  }

  function quote(text) {
    return block(lines(text).map(x => `> ${x}`));
  }

  function block(xs) {
    return `\n${xs.join('\n')}\n`;
  }

  function indent(text, spaces) {
    return lines(text).map((x, i) => `${i > 0? repeat(' ', spaces) : ''}${x}`)
                      .join('\n');
  }

  function list(xs) {
    return xs.map(x => `  - ${indent(x, 4)}`)
             .join('\n');
  }

  function code(text, language = 'javascript') {
    return block([
      `\`\`\`${language}`,
      text.trimRight(),
      '```'
    ]);
  }

  function table(object) {
    return list(entries(object).map(([k, v]) => `**${k}:**\n${v.isJust? v.get() : v}`));
  }

  function link(text, url) {
    return `[${text}](${url})`;
  }

  function summary(text) {
    const maybeParagraph = marked.lexer(text)[0];
    if (maybeParagraph && maybeParagraph.type === 'paragraph') {
      return maybeParagraph.text;
    } else {
      return '';
    }
  }

  function isObject(value) {
    return Object(value) === value;
  }

  function typeOf(value) {
    return typeof value === 'string'  ?  'String'
    :      typeof value === 'number'  ?  'Number'
    :      typeof value === 'boolean' ?  'Boolean'
    :      typeof value === 'symbol'  ?  'Symbol'
    :      value === null             ?  'Null'
    :      value === undefined        ?  'Undefined'
    :      /* otherwise */               'Unknown';
  }

  function intoObject(value) {
    if (isObject(value)) {
      return value;
    } else {
      return {
        [Symbol.for('@@meta:magical')]: {
          type: typeOf(value)
        }
      };
    }
  }


  // ---[ Rendering helpers ]------------------------------------------
  function signature(m) {
    return m.get(f.signature)
            .orElse(_ => m.get(f.name))
            .getOrElse('(Anonymous)');
  }

  function propertyRepresentation({ name, value, kind }) {
    return kind === 'getter'           ?  `get ${name}`
    :      kind === 'setter'           ?  `set ${name}`
    :      typeof value === 'function' ?  meta.for(value)
                                              .get(f.signature)
                                              .getOrElse(`${name}()`)
    :      /* otherwise */                name;
  }

  function renderDeprecation({ version, reason }) {
    return quote(block([
      `**Deprecated since ${version}**`,
      reason
    ]));
  }

  function renderStability(id) {
    const { name, index, description } = meta.Stability.fromIdentifier(id);
    return quote(block([
      `**Stability: ${index} - ${name}**`,
      description
    ]));
  }

  function renderPortability(value) {
    return value ? 'portable' : 'not portable';
  }

  function renderMeta(m) {
    return table(compact({
      'From':        m.get(f.module),
      'Defined in':  m.get(f.belongsTo).map(o => signature(meta.for(o()))),
      'Copyright':   m.get(f.copyright),
      'Licence':     m.get(f.licence),
      'Repository':  m.get(f.repository),
      'Category':    m.get(f.category),
      'Since':       m.get(f.since),
      'Portability': m.get(f.portable).map(renderPortability),
      'Platforms':   m.get(f.platforms).map(list),
      'Maintainers': m.get(f.maintainers).map(list),
      'Authors':     m.get(f.authors).map(list)
    }));
  }

  function renderFunctionMeta(m) {
    return table(compact({
      'Complexity': m.get(f.complexity),
      'Throws':     m.get(f.throws).map(table),
      'Parameters': m.get(f.parameters).map(table),
      'Returns':    m.get(f.returns)
    }));
  }

  function renderSource(source) {
    return block([
      title('Source', 2),
      code(source)
    ]);
  }

  function renderMember(property, options) {
    const m       = meta.for(intoObject(property.value));
    const doc     = m.get(f.documentation).getOrElse('(No documentation)');
    const skip    = options.skipDetailedPage || new Set();
    const prefix  = options.linkPrefix || '';
    const heading = `\`${propertyRepresentation(property)}\``;
    const url     = `${prefix}${property.name}`;

    return block([
      skip.has(property.name) ?  title(heading, 4)
      : /* otherwise */          title(link(heading, url), 4),
      renderFunctionMeta(m),
      m.get(f.type).map(x => code(x, 'haskell')).getOrElse(null),
      summary(doc)
    ]);
  }

  function renderProperties(m, options, prefix = 'Properties in') {
    const properties = m.properties();

    if (properties.length === 0) {
      return renderInheritedProperties(m.prototype(), options)
               .getOrElse('');
    } else {
      return block([
        title(`${prefix} \`${signature(m)}\``, 2),
        block(
          properties.map(({ category, members }) => block([
            title(category || 'Uncategorised', 3),
            block(members.map(p => renderMember(p, options)))
          ]))
        ),
        renderInheritedProperties(m.prototype(), options).getOrElse('')
      ]);
    }
  }

  function renderInheritedProperties(maybeInterface, options) {
    const skip = options.excludePrototypes || new Set();

    return maybeInterface.map(m => {
      return skip.has(m.object) ?  ''
      :      /* otherwise */       renderProperties(m, options, 'Properties inherited from');
    });
  }


  // ---[ Main rendering ]---------------------------------------------
  function toMarkdown(m, options) {
    return block([
      title(signature(m)),
      m.get(f.type).map(code).getOrElse(''),
      m.get(f.deprecated).map(renderDeprecation).getOrElse(''),
      '',
      m.get(f.stability).map(renderStability).getOrElse(''),
      '',
      renderMeta(m),
      renderFunctionMeta(m),
      '',
      m.get(f.documentation).getOrElse('(No documentation)'),
      m.get(f.source).map(renderSource).getOrElse(''),
      renderProperties(m, options)
    ]);
  }


  // ---[ Public interface ]-------------------------------------------
  function generate(object, options) {
    return toMarkdown(meta.for(object), options);
  }

  return { generate };
};
