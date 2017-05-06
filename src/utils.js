export const createEventEmitter = () => {
  const listeners = [];
  const trigger = function trigger(...args) {
    return listeners.map(listener => listener(...args));
  };
  trigger.subscribe = callback => {
    listeners.push(callback);
    return () => listeners.splice(listeners.indexOf(callback), 1);
  };

  return trigger;
};

export const reduceObject = (obj, reducer, initialValue) => Object.keys(obj).reduce(reducer, initialValue);
