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

const PORT = 8084;

describe('Angular form example', () => {
  beforeAll(async () => {
    const dist = path.resolve(__dirname, '../../../es');
    const src = path.resolve(__dirname, '../../../examples/codesandbox/form/angular');
    const tmpDir = process.env.CCE_EXAMPLE_TMPDIR;
    await setupDevServer({
      command: [
        `cp -r ${src} ${tmpDir}/form-angular`,
        `cd ${tmpDir}/form-angular`,
        'yarn install',
        'rm -Rf node_modules/carbon-custom-elements/es',
        `cp -r ${dist} node_modules/carbon-custom-elements`,
        `yarn ng serve --port ${PORT}`,
      ].join(' && '),
      launchTimeout: Number(process.env.LAUNCH_TIMEOUT),
      port: PORT,
    });
    page.on('dialog', async dialog => {
      const message = dialog.message();
      await dialog.dismiss();
      await page.evaluate(content => {
        document.body.insertAdjacentHTML('beforeend', `<div id="status-message">${content}</div>`);
      }, message);
    });
    await page.goto(`http://localhost:${PORT}`);
  }, Number(process.env.LAUNCH_TIMEOUT));

  it('should detect an invalid data', async () => {
    await page.fill('bx-input[name="username"] input', 'john');
    await page.fill('bx-input[name="password"] input', 'foo');
    await page.click('bx-btn[kind="primary"]');
    await expect(page).toHaveSelector('bx-input[name="password"][invalid]', { timeout: 2000 });
  });

  it('should submit the data once all data is valid', async () => {
    await page.fill('bx-input[name="username"] input', 'john');
    await page.fill('bx-input[name="password"] input', 'angular');
    await page.click('bx-btn[kind="primary"]');
    await expect(page).toHaveText('#status-message', 'You submitted:');
  });

  afterAll(async () => {
    await browser.close();
    await teardownDevServer();
  });
});
