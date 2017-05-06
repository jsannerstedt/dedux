import { reduceObject } from './utils';
/*

 Takes an object like {
   menu: {
     initialState: () => ({ menuOpen: false }),
     openMenu: (state, payload) => ({ menuOpen: payload })
   },
   somethingElse: {
     openMenu: (state, payload) => ({ showSideBar: !payload }),
     enterName: (state, payload) => ({ name: payload })
    }
 }

 and turns it into {
   openMenu: [ menu.openMenu, somethingElse.openMenu ],
   enterName: [ somethingElse.enterName ]
 }

 Every function is given a namespace property with their parent object key as value. This can later be used to divide the state object.

 */

const ensureInitialState = modifiers => modifiers.initialState ? modifiers : Object.assign({}, modifiers, { initialState: () => ({}) });

export default collection =>
  reduceObject(collection, (map, namespace) => {
    const modifiers = ensureInitialState(collection[namespace]);
    return reduceObject(modifiers, (map, name) => {
      const modifier = modifiers[name];
      modifier.key = namespace;
      map[name] = map[name] || [];
      map[name].push(modifier);
      return map;
    }, map);
  }, {});
