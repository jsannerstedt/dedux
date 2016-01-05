'use strict';

import { extend, createEventStore } from './utils';

export default (modifiers, actions, initialState) => {
  const events = createEventStore();
  let state = {};
  runModifiers(modifiers.initialState || []);
  state = extend(state, initialState);

  Object.keys(modifiers)
    .forEach(action => actions[action] && actions[action].subscribe(payload => updateState(action, payload)));

  return {
    subscribe: events.on,
    getState: () => state
  };

  function updateState(action, payload) {
    if (modifiers[action]) {
      runModifiers(modifiers[action], payload);
      events.trigger(state);
    }
  }

  function runModifiers(selectedModifiers, payload) {
    selectedModifiers.forEach(modifier =>
      state[modifier.namespace] = extend(state[modifier.namespace], modifier(payload, state[modifier.namespace]))
    );
  }
};
