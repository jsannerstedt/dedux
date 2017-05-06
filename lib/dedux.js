(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.dedux = global.dedux || {})));
}(this, (function (exports) { 'use strict';

var createEventEmitter = function createEventEmitter() {
  var listeners = [];
  var trigger = function trigger() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return listeners.map(function (listener) {
      return listener.apply(undefined, args);
    });
  };
  trigger.subscribe = function (callback) {
    listeners.push(callback);
    return function () {
      return listeners.splice(listeners.indexOf(callback), 1);
    };
  };

  return trigger;
};

var reduceObject = function reduceObject(obj, reducer, initialValue) {
  return Object.keys(obj).reduce(reducer, initialValue);
};

var createStore = (function (modifiers, actions, initialState) {
  var eventEmitter = createEventEmitter();
  var state = {};
  runModifiers(modifiers.initialState || []);

  if (initialState) {
    Object.assign(state, initialState);
  }

  Object.keys(modifiers).forEach(function (action) {
    return actions[action] && actions[action].subscribe(function () {
      for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
        payload[_key] = arguments[_key];
      }

      return updateState.apply(undefined, [action].concat(payload));
    });
  });

  return {
    subscribe: eventEmitter.subscribe,
    getState: function getState() {
      return state;
    }
  };

  function updateState(action) {
    if (modifiers[action]) {
      for (var _len2 = arguments.length, payload = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        payload[_key2 - 1] = arguments[_key2];
      }

      runModifiers.apply(undefined, [modifiers[action]].concat(payload));
      eventEmitter.apply(undefined, [state, action].concat(payload));
    }
  }

  function runModifiers(selectedModifiers) {
    for (var _len3 = arguments.length, payload = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      payload[_key3 - 1] = arguments[_key3];
    }

    selectedModifiers.forEach(function (modifier) {
      return state[modifier.key] = Object.assign({}, state[modifier.key] || {}, modifier.apply(undefined, [state[modifier.key]].concat(payload)));
    });
  }
});

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

var ensureInitialState = function ensureInitialState(modifiers) {
  return modifiers.initialState ? modifiers : Object.assign({}, modifiers, { initialState: function initialState() {
      return {};
    } });
};

var combineModifiers = (function (collection) {
  return reduceObject(collection, function (map, namespace) {
    var modifiers = ensureInitialState(collection[namespace]);
    return reduceObject(modifiers, function (map, name) {
      var modifier = modifiers[name];
      modifier.key = namespace;
      map[name] = map[name] || [];
      map[name].push(modifier);
      return map;
    }, map);
  }, {});
});

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var actionCreator = (function (actionNames) {
  return actionNames.reduce(function (actions, name) {
    return Object.assign(actions, defineProperty({}, name, createEventEmitter()));
  }, {});
});

exports.createStore = createStore;
exports.createActions = actionCreator;
exports.combineModifiers = combineModifiers;

Object.defineProperty(exports, '__esModule', { value: true });

})));
