/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/* eslint-disable import/no-extraneous-dependencies, global-require */

const path = require('path');

function normalizeBrowser(browser) {
  return (
    {
      chrome: `Chrome${process.env.TRAVIS ? '_Travis' : ''}`,
      firefox: 'Firefox',
      safari: 'Safari',
      ie: 'IE',
    }[browser.toLowerCase()] || browser
  );
}

module.exports = function setupKarmaIBMa(config) {
  const { browsers, specs, useExperimentalFeatures, verbose } = config.customConfig;

  config.set({
    basePath: '..',

    browsers: (browsers.length > 0 ? browsers : ['ChromeHeadless']).map(normalizeBrowser),

    frameworks: ['jasmine', 'AAT'],

    files: ['tests/a11y/karma-setup-context.ts', 'src/polyfills/index.ts'].concat(
      specs.length > 0 ? specs : ['tests/a11y/karma-test-shim.ts']
    ),

    preprocessors: {
      'src/**/*.[jt]s': ['webpack', 'sourcemap'],
      'tests/a11y/**/*.ts': ['webpack', 'sourcemap'],
      'tests/karma-test-shim.js': ['webpack', 'sourcemap'],
      'tests/utils/**/*.js': ['webpack', 'sourcemap'],
    },

    webpack: {
      mode: 'development',
      devtool: 'inline-source-maps',
      resolve: {
        extensions: ['.js', '.ts'],
      },
      module: {
        rules: [
          {
            test: /@carbon[\\/]icons[\\/]/i,
            use: [require.resolve('../svg-result-carbon-icon-loader')],
          },
          {
            test: /\.ts$/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  configFile: path.resolve(__dirname, '..', '.babelrc'),
                  plugins: [['babel-plugin-transform-inline-environment-variables', { include: 'AAT_VERBOSE' }]],
                },
              },
            ],
          },
          {
            test: /\.js$/,
            include: [
              __dirname,
              path.dirname(require.resolve('lit-html')),
              path.dirname(require.resolve('lit-element')),
              path.dirname(require.resolve('@webcomponents/custom-elements')),
              // `ShadyCSS` NPM package is missing its entry point file
              path.dirname(require.resolve('@webcomponents/shadycss/scoping-shim.min.js')),
              path.dirname(require.resolve('@webcomponents/shadydom')),
              path.resolve(__dirname, '..', 'src/polyfills'),
            ],
            use: {
              loader: 'babel-loader',
              options: {
                configFile: path.resolve(__dirname, '..', '.babelrc'),
              },
            },
          },
          {
            test: /\.scss$/,
            sideEffects: true,
            use: [
              require.resolve('../css-result-loader'),
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => [
                    require('autoprefixer')({
                      browsers: ['last 1 version', 'ie >= 11'],
                    }),
                  ],
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  includePaths: [path.resolve(__dirname, '..', 'node_modules')],
                  data: `
                  $feature-flags: (
                    grid: ${useExperimentalFeatures},
                    ui-shell: true,
                  );
                `,
                },
              },
            ],
          },
        ],
      },
    },

    webpackMiddleware: {
      noInfo: !verbose,
    },

    customLaunchers: {
      Chrome_Travis: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
      },
    },

    plugins: [
      require('karma-jasmine'),
      require('karma-spec-reporter'),
      require('karma-sourcemap-loader'),
      require('karma-webpack'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-safari-launcher'),
      require('@ibma/karma-ibma'), // eslint-disable-line import/no-unresolved
    ],

    reporters: ['spec', 'AAT'],

    port: 9876,

    colors: true,

    logLevel: verbose ? config.LOG_DEBUG : config.LOG_INFO,

    autoWatch: true,
    autoWatchBatchDelay: 400,

    browserNoActivityTimeout: 60000,

    concurrency: Infinity,
  });
};
