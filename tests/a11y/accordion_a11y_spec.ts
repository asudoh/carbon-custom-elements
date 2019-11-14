/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html, render } from 'lit-html';
import testAATCompliance from './test-a11y-compliance';
import '../../src/components/accordion/accordion';
import '../../src/components/accordion/accordion-item';

const template = ({ open }: { open?: boolean } = {}) =>
  html`
    <bx-accordion>
      <bx-accordion-item ?open="${open}">Foo</bx-accordion-item>
    </bx-accordion>
  `;

describe('a11y compliance of bx-accordion', function() {
  const container = document.getElementById('html-fragment-container');

  it('Should have a11y compliant default state', async function() {
    render(template(), container!);
    await Promise.resolve();
    await testAATCompliance(container!, 'bx-accordion: Default state');
  });

  it('Should have a11y compliant open state', async function() {
    render(template({ open: true }), container!);
    await Promise.resolve();
    await testAATCompliance(container!, 'bx-accordion: Open state');
  });

  afterEach(function() {
    render(undefined!, container!);
  });
});
