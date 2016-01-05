'use strict';

import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  dest: 'lib/dedux.js',
  format: 'umd',
  moduleName: 'dedux',
  plugins: [ babel() ]
};
