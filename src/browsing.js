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

// -- Dependencies -----------------------------------------------------
var chalk = require('chalk');
var marked = require('marked');
var TerminalRenderer = require('marked-terminal');
var extend = require('xtend');

var mm = require('../interface');
var meta = require('../decorators');
var Refinable = require('./refinable');
var Stability = require('./stability');


// -- Initialisation ---------------------------------------------------
marked.setOptions({
  renderer: new TerminalRenderer({
    reflowText: true,
    width: 72
  })
});


// -- Aliases ----------------------------------------------------------
var error = chalk.red;
var heading = chalk.green.bold;
var subHeading = chalk.bold;
var faded = chalk.grey;
var flag = chalk.grey.italic;
var label = chalk.bold;
var minorHeading = chalk.bold;
var write = console.log.bind(console);
var prototypeOf = Object.getPrototypeOf;
var properties = Object.getOwnPropertyNames;
var property = Object.getOwnPropertyDescriptor;

// -- Helpers ----------------------------------------------------------
function repeat(text, times) {
  return Array.apply(null, Array(times + 1)).join(text);
}

function lines(text) {
  return text.split(/\r\n|\n\r|\r|\n/);
}

function getObjectMeta(object) {
  var result = {};
  if (Object(object) !== object) {
    return result;
  }
  while (object != null) {
    result = extend(mm.get(object), result);
    object = prototypeOf(object);
  }

  return result;
}

function signature(meta) {
  return meta.signature || meta.name || '(Anonymous Object)';
}

function toMarkdown(text) {
  return marked(text.replace(/\[\[([^\]]+)\]\]/g, '`$1`').trim());
}

function category(meta) {
  return meta.category || '(Uncategorised)';
}

function name(meta) {
  return meta.name || '(Anonymous Object)';
}

function groupBy(f, xs) {
  return xs.reduce(function(map, x) {
    var key = f(x);
    var ys = map.get(key) || [];
    ys.push(x);
    map.set(key, ys);
    return map;
  }, new Map());
}

function toPairs(map) {
  return [...map.entries()];
}

function isFunction(a) {
  return typeof a === 'function';
}

function describe(p, name) {
  return [
    p.value && isFunction(p.value)?  name + '()'
  : p.get && p.set?                  'get/set ' + name
  : p.get?                           'get ' + name
  : p.set?                           'set ' + name
  : /* otherwise */                  name
  , p];
}

function prop(object) {
  return (key) => {
    try {
      var p = property(object, key);
      return [describe(p, key), object[key]];
    } catch(e) {
      return null;
    }
  };
}

function summary(meta) {
  var doc = (meta.documentation || '').split(/(\r?\n|\n?\r){2,}/)[0];
  if (doc.length > 73) {
    doc = doc.slice(0, 70) + '...';
  }
  return doc.replace(/\r?\n/g, ' ').trim();
}


// -- Implementation ---------------------------------------------------
var TerminalDisplay = Refinable.refine({
  toString() {
    return '[object TerminalDisplay]';
  },

  heading(text) {
    write(heading(text));
    write(heading(repeat("=", text.length)));
    write("");
  },

  subHeading(text) {
    write(subHeading(text));
    write(subHeading(repeat("-", text.length)));
  },

  minorHeading(text) {
    write(minorHeading(text));
  },

  markdown(text) {
    write(toMarkdown(text.trim()));
  },

  indented(indent, text) {
    var pad = repeat(" ", indent);
    write(lines(text).map(x => pad + x).join("\n"));
  },

  lineBreak() {
    write("");
  },

  field(fieldLabel, text) {
    write(label(fieldLabel) + ": " + text);
  },

  line(text) {
    write(text);
  }
});

var Browser = Refinable.refine({
  toString() {
    return '[object Browser]';
  },

  target() {
    return this;
  },

  display: TerminalDisplay,

  object(x) {
    return this.refine({ target: _ => x });
  },

  property(name) {
    var target = this.target();
    if (!(name in target)) {
      throw new Error(`Object ${target} has no property ${name}`);
    }
    return this.object(target[name]);
  },

  show() {
    var meta = getObjectMeta(this.target());
    this.display.heading(signature(meta));
    this.metadata();
    this.display.lineBreak();

    this.documentation();
    this.display.lineBreak();
    this.source();
    this.display.lineBreak();
    this.stability();
    this.display.lineBreak();
    this.methods();
  },

  methods() {
    var target = this.target();
    var display = this.display;
    var meta = getObjectMeta(target);
    display.subHeading(`Messages in ${name(meta)}`);
    showMessages(target);

    function showMessages(target) {
      var methods = properties(target).sort().map(prop(target)).filter(Boolean);
      var byCategory = ([_, o]) => category(getObjectMeta(o));
      var pairs = toPairs(groupBy(byCategory, methods)).sort();
      pairs.forEach(([category, methods]) => {
        display.lineBreak();
        display.minorHeading(category);
        var nameLength = Math.max.apply(null, methods.map(([[name]]) => name.length));
        methods.forEach(([[name, descriptor], method]) => {
          var meta = getObjectMeta(method);
          var flags = [
            descriptor.enumerable?    'enum' : '',
            descriptor.configurable?  'config' : '',
            descriptor.writable?      'write' : ''
          ].filter(Boolean).join(', ');
          if (flags)  flags = '(' + flags + ')';
          var pad = repeat(" ", nameLength - name.length);

          display.line(`  • ${name}   ${pad}${flag(flags)}`);
          var doc = summary(meta);
          if (doc) {
            display.line(faded(`    | ${summary(meta)}`));
          }
        });
      });

      display.lineBreak();
      var parent = prototypeOf(target);
      if (parent != null) {
        var meta = getObjectMeta(parent);
        display.subHeading(`Inheriting from ${name(meta)}`);
        showMessages(parent);
      }
    }
  },

  source() {
    var target = this.target();
    if (typeof target === "function") {
      var meta = getObjectMeta(target);
      var name = meta.name || '(Anonymous Object)';
      this.display.subHeading("Source for " + name);
      this.display.markdown("```js\n" + target.toString() + "\n```");
    }
  },

  documentation() {
    var meta = getObjectMeta(this.target());
    if (meta.documentation) {
      this.display.markdown(meta.documentation);
    } else {
      this.display.line("(No documentation)");
    }
  },

  metadata() {
    var meta = getObjectMeta(this.target());
    var d = this.display;
    if (meta.complexity) {
      d.field("Complexity", meta.complexity);
    }
    if (meta.type) {
      d.field("Type", meta.type);
    }
    if (meta.category) {
      d.field("Category", meta.category);
    }
    if (meta.tags) {
      d.field("Tags", meta.tags.join(", "));
    }
    if (meta.since) {
      d.field("Since", "version " + meta.since);
    }
    if (meta.platforms) {
      d.field("Platforms", meta.platforms.join(", "));
    }
    if (meta.licence) {
      d.field("Licence", meta.licence);
    }
    if (meta.repository) {
      d.field("Repository", meta.repository);
    }
    if (meta.portability) {
      d.field("Portability", meta.portability);
    }
  },

  stability() {
    var meta = getObjectMeta(this.target());
    if (meta.stability && Stability[meta.stability]) {
      this.display.markdown(Stability[meta.stability].explain());
      this.display.lineBreak();
    }
  }
});


// -- Documentation ----------------------------------------------------
meta(Browser, {
   name      : 'Browser',
   category  : 'Inspecting',
   tags      : ['Documentation', 'Browsing'],
   stability : 'experimental',
   platforms : ['ECMAScript 2015'],
   licence   : 'MIT',
   authors   : ['Quildreen Motta'],
   documentation: `
 Allows an user to learn about objects in the system, either by finding
 objects that can do the task they want to, or by inspecting information
 about what they can do with an object.

 A browser is always looking at a particular [[Object]]. The browser can
 be refined while you interact with it, in a "navigation" kind-of way.
 By default, the browser looks at itself. From there an user can navigate
 to other objects, or particular properties in the object by refining it
 (this is similar to how \`cd\` works in a shell). The [[.object()]] and
 [[.property()]] methods respectively allow these refinements:

     var inspect = Browser.property("inspect");
     inspect.documentation();
     // Documentation for Browser.inspect()
     // -----------------------------------
     //
     // Inspects the object this browser is pointing to.

     var object = Browser.object(Object);
     object.metadata();
     // Metadata for Object
     // -------------------
     //
     // Category: Built-in
     // Platforms: [ECMAScript]

 Besides the [[object]] configuration, the Browser also expects a
 [[display]], which determines how the information output will be
 formatted in whatever medium you're targeting. The prototypical
 Browser comes configured with a [[TerminalDisplay]], which outputs
 information for terminal emulators. You can refine the Browser to
 provide a display for a different medium.

 For example, if one wanted to use the browser to generate an HTML
 page with the information, they would just need to provide a new
 display configuration:

     var h = require('html');
     var markdown = require('markdown');
     var HTMLDisplay = Browser.display.refine({
       documentation(meta) {
         return h('div',
           h('h1', 'Documentation for ' + meta.signature),
           h('div.documentation', markdown(meta.documentation))
         )
       }
     });

     var HTMLBrowser = Browser.refine({ display: _ => HTMLDisplay });
     HTMLBrowser.documentation()
     // "<div><h1>Documentation for Browser</h1><div ..."
   `
 });

meta(Browser.toString, {
  name: 'toString',
  signature: '.toString()',
  type: 'Object.() -> String',
  category: 'Inspecting',
  documentation: 'A textual description of this object'
});

// -- Exports ----------------------------------------------------------
module.exports = Browser;
