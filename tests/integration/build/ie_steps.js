/**
 * @license
 *
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const path = require('path');
const { setup: setupDevServer, teardown: teardownDevServer } = require('jest-dev-server');

const PORT = 8081;

describe('IE example', () => {
  beforeAll(async () => {
    const dist = path.resolve(__dirname, '../../../es');
    const src = path.resolve(__dirname, '../../../examples/codesandbox/ie');
    const tmpDir = process.env.CCE_EXAMPLE_TMPDIR;
    await setupDevServer({
      command: [
        `cp -r ${src} ${tmpDir}`,
        `cd ${tmpDir}/ie`,
        'yarn install',
        'rm -Rf node_modules/carbon-custom-elements/es',
        `cp -r ${dist} node_modules/carbon-custom-elements`,
        `yarn webpack-dev-server --mode=development --open=false --port=${PORT}`,
      ].join(' && '),
      launchTimeout: Number(process.env.LAUNCH_TIMEOUT),
      port: PORT,
    });
    await page.goto(`http://localhost:${PORT}`);
  }, Number(process.env.LAUNCH_TIMEOUT));

  it('should show a title', async () => {
    await expect(page).toHaveText('Hello World!');
  });

  it('should have dropdown interactive', async () => {
    await page.click('bx-dropdown');
    await expect(page).toHaveSelector('bx-dropdown[open]');
    await page.click('bx-dropdown');
    await expect(page).toHaveSelector('bx-dropdown:not([open])');
  });

  afterAll(async () => {
    await teardownDevServer();
  });
});
