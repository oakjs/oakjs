import { rollup } from "rollup";
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import npm from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';

export default {
  entry: './theme/index.js',
  format: 'iife',
  dest: '../../src/client/public/build/projects/SUI/theme.js',
  moduleName: '__ignored',
  plugins: [
    postcss(),
    json(),
    babel(),
    commonjs(),
    npm(),
//    uglify()
  ]
};
