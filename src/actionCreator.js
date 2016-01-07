'use strict';

import { createEventEmitter } from './utils';

export default actionNames => actionNames.reduce((actions, name) => {
  actions[name] = createEventEmitter();
  return actions;
}, {});
