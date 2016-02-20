import { rollup } from "rollup";
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import npm from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'acorn.js',
  format: 'iife',
  dest: '../../public/lib/acorn.js',
  moduleName: 'acorn',
  plugins: [
    json(),
    babel(),
    commonjs(),
    npm(),
    uglify()
  ]
};
