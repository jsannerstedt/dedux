(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  factory((global.dedux = {}));
}(this, function (exports) { 'use strict';

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

  var reduceObject = function reduceObject(obj, reducer, initialValue) {
    return Object.keys(obj).reduce(reducer, initialValue);
  };

  var combineModifiers = (function (collection) {
    return reduceObject(collection, function (map, namespace) {
      return reduceObject(collection[namespace], function (map, name) {
        var modifier = collection[namespace][name];
        modifier.key = namespace;
        map[name] = map[name] || [];
        map[name].push(modifier);
        return map;
      }, map);
    }, {});
  })

  function createEventEmitter() {
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
  }

  var createActions = (function (actionNames) {
    return actionNames.reduce(function (actions, name) {
      actions[name] = createEventEmitter();
      return actions;
    }, {});
  })

  var createStore = (function (modifiers, actions, initialState) {
    var eventEmitter = createEventEmitter();
    var state = {};
    runModifiers(modifiers.initialState || []);

    if (initialState) {
      Object.assign(state, initialState);
    }

    Object.keys(modifiers).forEach(function (action) {
      return actions[action] && actions[action].subscribe(function (payload) {
        return updateState(action, payload);
      });
    });

    return {
      subscribe: eventEmitter.subscribe,
      getState: function getState() {
        return state;
      }
    };

    function updateState(action, payload) {
      if (modifiers[action]) {
        runModifiers(modifiers[action], payload);
        eventEmitter(state, action, payload);
      }
    }

    function runModifiers(selectedModifiers, payload) {
      selectedModifiers.forEach(function (modifier) {
        return state[modifier.key] = Object.assign({}, state[modifier.key] || {}, modifier(payload, state[modifier.key]));
      });
    }
  })

  exports.createStore = createStore;
  exports.createActions = createActions;
  exports.combineModifiers = combineModifiers;

}));