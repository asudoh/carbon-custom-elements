'use strict';

const { readFile } = require('fs');
const path = require('path');
const { promisify } = require('util');
const { transformAsync } = require('@babel/core');
const babelPluginCreateReactCustomElementType = require('./babel-plugin-create-react-custom-element-type');

const readFileAsync = promisify(readFile);

const buildCreateReactCustomElementTypeBabelOpts = {
  babelrc: false,
  plugins: [
    ['@babel/plugin-syntax-decorators', { decoratorsBeforeExport: true }],
    '@babel/plugin-syntax-typescript',
    babelPluginCreateReactCustomElementType,
  ],
};

/**
 * @param {string} src The path of the source file.
 * @param {TransformOptions} options The Babel options.
 * @returns The Babel transform result.
 */
const readAndTransform = async (src, options) =>
  transformAsync(await readFileAsync(src), {
    ...buildCreateReactCustomElementTypeBabelOpts,
    ...options,
  });

/**
 * A WebPack loader that takes a fake resource path,
 * finds the corresponding source file path that can generate the content for the fake resource path from, loads it,
 * and generates the content the fake resource path with Babel.
 * @returns {string} The massaged module content.
 */
function createReactCustomElementTypeLoader() {
  const callback = this.async();
  const { resourcePath } = this;
  const relativePath = path.relative(path.resolve(__dirname, 'es/components-react'), resourcePath);
  const src = path.resolve(__dirname, 'src/components', relativePath).replace(/\.js$/, '.ts');
  readAndTransform(src, { filename: src }).then(({ code }) => {
    callback(null, code);
  }, callback);
}

module.exports = createReactCustomElementTypeLoader;
