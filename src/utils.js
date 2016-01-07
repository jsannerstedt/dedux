'use strict';

export { createEventEmitter };

function createEventEmitter() {
  const listeners = [];
  const trigger = data => listeners.forEach(listener => listener(data));
  trigger.subscribe = callback => {
    listeners.push(callback);
    return () => listeners.splice(listeners.indexOf(callback), 1);
  };

  return trigger;
}
