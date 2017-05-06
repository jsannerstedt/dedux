import { createEventEmitter } from './utils';

export default (modifiers, actions, initialState) => {
  const eventEmitter = createEventEmitter();
  const state = {};
  runModifiers(modifiers.initialState || []);

  if (initialState) {
    Object.assign(state, initialState);
  }

  Object.keys(modifiers)
    .forEach(action => actions[action] && actions[action].subscribe((...payload) => updateState(action, ...payload)));

  return {
    subscribe: eventEmitter.subscribe,
    getState: () => state
  };

  function updateState(action, ...payload) {
    if (modifiers[action]) {
      runModifiers(modifiers[action], ...payload);
      eventEmitter(state, action, ...payload);
    }
  }

  function runModifiers(selectedModifiers, ...payload) {
    selectedModifiers.forEach(modifier =>
      state[modifier.key] = Object.assign({}, state[modifier.key] || {}, modifier(state[modifier.key], ...payload))
    );
  }
};
