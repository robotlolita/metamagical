//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const properties = Object.getOwnPropertyNames;


function isObject(object) {
  return Object(object) === object;
}

function values(object) {
  return properties(object).map(key => object[key]);
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

  function defineTests(object) {
    if (!isObject(object) || visited.has(object))  return;

    const m = meta.forObject(object);

    visited.add(object);

    m.get('name').chain(name => {
      describe(name, () => {
        m.get('examples').chain(examples => {
          groupBy(examples, exampleDescription).forEach(([k, fs]) => {
            it(k, () => {
              fs.forEach(f => f.call());
            });
          });
        });

        values(object).forEach(defineTests);
      });
    });
  }

  defineTests(object);
};
