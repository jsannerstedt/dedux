'use strict';

import { createEventStore } from './utils';

export default actionNames => actionNames.reduce((actions, name) => {
  actions[name] = getAction();
  return actions;
}, {});

function getAction() {
  const events = createEventStore();
  const func = data => events.trigger(data);
  func.subscribe = events.on;

  return func;
}
