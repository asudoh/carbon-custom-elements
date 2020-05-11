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

const PORT = 3000;

describe('React example', () => {
  beforeAll(async () => {
    const dist = path.resolve(__dirname, '../../../es');
    const src = path.resolve(__dirname, '../../../examples/codesandbox/react');
    const tmpDir = process.env.CCE_EXAMPLE_TMPDIR;
    await setupDevServer({
      command: [
        `cp -r ${src} ${tmpDir}`,
        `cd ${tmpDir}/react`,
        'yarn install',
        'rm -Rf node_modules/carbon-custom-elements/es',
        `cp -r ${dist} node_modules/carbon-custom-elements`,
        `BROWSER=none PORT=${PORT} yarn start`,
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
    await browser.close();
    await teardownDevServer();
  });
});
