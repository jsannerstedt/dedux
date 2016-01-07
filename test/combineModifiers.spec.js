'use strict';

import { assert } from 'chai';
import combineModifiers from '../src/combineModifiers';

describe('combineModifiers', () => {
  it('should return a modifiers map', () => {
    const modifiers = combineModifiers({
      menu: {
        initialState: () => ({ menuOpen: false }),
        openMenu: payload => ({ menuOpen: payload })
      },
      somethingElse: {
        openMenu: payload => ({ showSideBar: !payload }),
        enterName: payload => ({ name: payload })
      }
    });

    assert.isArray(modifiers.openMenu);
    assert.isArray(modifiers.enterName);
    assert.equal(2, modifiers.openMenu.length);
    assert.equal(1, modifiers.enterName.length);
  });
  describe('modifier', () => {
    it('should have a key property, when created', () => {
      const modifiers = combineModifiers({
        one: { open: () => ({}) }
      });
      assert.equal(modifiers.open[0].key, 'one');
    });
  });
});
