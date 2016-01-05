'use strict';

import { assert } from 'chai';
import createActions from '../src/actionCreator';

describe('createActions', () => {
  it('should return actions', () => {
    const actions = createActions(['one', 'two']);
    assert.isFunction(actions.one);
    assert.isFunction(actions.two);
  });

  describe('action', () => {
    it('should notify listeners, when running an action', () => {
      const actions = createActions(['one']);
      actions.one.subscribe(val => assert.equal('test', val));
      actions.one('test');
    });
  });
});
