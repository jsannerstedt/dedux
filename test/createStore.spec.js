'use strict';

import { assert } from 'chai';
import createStore from '../src/createStore';
import createActions from '../src/actionCreator';
import combineModifiers from '../src/combineModifiers';

describe('createStore', () => {
  it('should return a new store', () => {
    const store = createStore({}, {});
    assert.deepEqual(store.getState(), {});
    assert.isFunction(store.subscribe);
  });
  it('should include the provided initial state', () => {
    const initial = { one: 'two' };
    const store = createStore({}, {}, initial);
    assert.deepEqual(store.getState(), initial);
  });
  it('should run reducers for initial state', () => {
    const modifiers = combineModifiers({
      menu: {
        initialState: () => ({ menuOpen: false })
      }
    });
    const actions = createActions(Object.keys(modifiers));
    const store = createStore(modifiers, actions);
    assert.deepEqual(store.getState(), { menu: { menuOpen: false } });
  });
  it('should modify state when running an action', () => {
    const modifiers = combineModifiers({
      menu: {
        toggleMenu: payload => ({ menuOpen: payload })
      }
    });
    const actions = createActions(Object.keys(modifiers));
    const store = createStore(modifiers, actions);
    actions.toggleMenu(true);
    assert.deepEqual(store.getState(), { menu: { menuOpen: true } });
  });
  it('should notify subscribers with new state when running an action', () => {
    const modifiers = combineModifiers({
      menu: {
        toggleMenu: payload => ({ menuOpen: payload })
      }
    });
    const actions = createActions(Object.keys(modifiers));
    const store = createStore(modifiers, actions);
    store.subscribe(state => {
      assert.deepEqual({ menu: { menuOpen: true } }, state);
    });
    actions.toggleMenu(true);
  });
  it('should notify subscribers with action and payload', () => {
    const modifiers = combineModifiers({
      menu: {
        toggleMenu: payload => ({ menuOpen: payload })
      }
    });
    const actions = createActions(Object.keys(modifiers));
    const store = createStore(modifiers, actions);
    store.subscribe((state, action, payload) => {
      assert.equal('toggleMenu', action);
      assert.ok(payload);
    });
    actions.toggleMenu(true);
  });
  it('should create a new object, when modifing state', function(){
    const modifiers = combineModifiers({
      menu: {
        initialState: () => ({ menuOpen: true }),
        toggleMenu: payload => ({ menuOpen: payload })
      }
    });
    const actions = createActions(Object.keys(modifiers));
    const store = createStore(modifiers, actions);
    const state = store.getState().menu;
    actions.toggleMenu(true);
    // should not be the same object, but should look the same
    assert.notEqual(state, store.getState().menu);
    assert.deepEqual(state, store.getState().menu);
  });
});
