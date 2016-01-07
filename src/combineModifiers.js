'use strict';

/*

Takes an object like {
  menu: {
    initialState: () => ({ menuOpen: false }),
    openMenu: payload => ({ menuOpen: payload })
  },
  somethingElse: {
    openMenu: payload => ({ showSideBar: !payload }),
    enterName: payload => ({ name: payload })
  }
}

and turns it into {
  openMenu: [ menu.openMenu, somethingElse.openMenu ],
  enterName: [ somethingElse.enterName ]
}

Every function is given a namespace property with their parent object key as value. This can later be used to divide the state object.

*/

const reduceObject = (obj, reducer, initialValue) => Object.keys(obj).reduce(reducer, initialValue);

export default collection =>
  reduceObject(collection, (map, namespace) =>
    reduceObject(collection[namespace], (map, name) => {
      const modifier = collection[namespace][name];
      modifier.key = namespace;
      map[name] = map[name] || [];
      map[name].push(modifier);
      return map;
    }, map), {});
