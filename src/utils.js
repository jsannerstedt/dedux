'use strict';

export { createEventEmitter };

function createEventEmitter() {
  const listeners = [];
  const trigger = function trigger(...args) {
    return listeners.map(listener => listener(...args));
  };
  trigger.subscribe = callback => {
    listeners.push(callback);
    return () => listeners.splice(listeners.indexOf(callback), 1);
  };

  return trigger;
}
