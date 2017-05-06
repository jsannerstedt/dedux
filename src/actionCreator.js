import { createEventEmitter } from './utils';

export default actionNames => actionNames.reduce((actions, name) =>
  Object.assign(actions, { [name]: createEventEmitter() }), {});
