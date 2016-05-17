//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 */
module.exports = function(meta, name, root, options = {}) {
  let result     = {};
  let references = new Map(options.references ? options.references.entries() : []);
  let skip       = options.skip || new Set();


  function isObject(value) {
    return Object(value) === value;
  }

  function arrayFromFilePath(path) {
    return path.split('/');
  }

  function computeIndexPath(object, path) {
    return meta.for(object)
               .get(meta.fields.module)
               .map(m => arrayFromFilePath(m))
               .getOrElse(['(unknown module)', ...path]);
  }

  function isModule(object) {
    return meta.for(object).get(meta.fields.isModule).getOrElse(false);
  }

  function allowsPopping(path) {
    return (path[0] === '(unknown module)' && path.length > 1)
    ||     path.length > 0;
  }

  function insertObject(name, path, object) {
    let parentPath = computeIndexPath(object, path);
    if (isModule(object) && allowsPopping(parentPath)) {
      name = parentPath.pop();
    }

    references.set(object, [...parentPath, name].join('/'));

    let where = parentPath.reduce((container, key) => {
      container[key] = container[key] || { children: [] };
      return container[key].children;
    }, result);

    where[name] = where[name] || { children: [] };
    where[name].type   = 'object';
    where[name].object = object;

    return where[name];
  }

  function go(where, name, object, path) {
    if (!isObject(object) || skip.has(object)) {
      return;
    }
    if (references.has(object)) {
      where[name] = { reference: references.get(object), type: 'reference' };
    } else {
      let data = insertObject(name, path, object);
      meta.for(object).properties().forEach(({ members }) => members.forEach(p =>
        go(data.children, p.name, p.value, [...path, name])
      ));
    }
  }

  go(result, name, root, []);
  return result;
};
