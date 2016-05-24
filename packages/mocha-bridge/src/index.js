//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


function isObject(object) {
  return Object(object) === object;
}

function groupBy(xs, f) {
  let groups = new Map();

  xs.forEach(x => {
    const key    = f(x);
    const values = groups.get(key) || [];
    values.push(x);
    groups.set(key, values);
  });

  return [...groups.entries()];
}

function exampleDescription(example) {
  return example.name    ?  example.name.replace(/_/, ' ')
  :      /* otherwise */    'Meta:Magical examples';
}


module.exports = (meta, describe, it) => (object) => {
  let visited = new Set();
  const _ = meta.fields;

  function isProvided(kind, value) {
    if (kind !== 'getter') {
      return isObject(value);
    } else {
      return !meta.for(value).get(_.isRequired).getOrElse(false);
    }
  }

  function defineTests(object) {
    if (!isObject(object) || visited.has(object))  return;

    const m = meta.for(object);

    visited.add(object);

    m.get(_.examples).chain(examples => {
      const exampleGroups = groupBy(examples, exampleDescription);
      exampleGroups.forEach(([heading, functions]) => {
        it(heading, () => functions.forEach(f => f.call()));
      });
    });

    m.properties().forEach(({ category, members }) => {
      describe(`(${category})`, () => {
        members.forEach(({ name, kind, value }) => {
          if (isProvided(kind, value)) {
            describe(`.${name}`, () => defineTests(value));
          }
        });
      });
    });
  }

  meta.for(object).get(_.name).chain(name => {
    describe(`Examples in ${name}`, () => {
      defineTests(object);
    });
  });
};
