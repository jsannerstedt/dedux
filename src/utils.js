'use strict';

export { extend, forOwn, createEventStore };

function createEventStore() {
  const listeners = [];

  return {
    on: callback => {
      listeners.push(callback);
      return () => listeners.splice(listeners.indexOf(callback), 1);
    },
    trigger: data => listeners.forEach(listener => listener(data))
  };
}

function forOwn(object, cb) {
  let i;
  if (!object) {
    return;
  }
  for (i in object) {
    if (object.hasOwnProperty(i)) {
      cb(object[i], i);
    }
  }
}

function extend(...args) {
  return Object.assign({}, ...args);
}
