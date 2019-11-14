/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html, render } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import testAATCompliance from './test-a11y-compliance';
import { BUTTON_KIND } from '../../src/components/button/button';

const template = ({
  autofocus,
  disabled,
  download,
  href,
  hreflang,
  kind,
  ping,
  rel,
  small,
  target,
  type,
}: {
  autofocus?: boolean;
  disabled?: boolean;
  download?: string;
  href?: string;
  hreflang?: string;
  kind?: BUTTON_KIND;
  ping?: string;
  rel?: string;
  small?: boolean;
  target?: string;
  type?: string;
} = {}) =>
  html`
    <bx-btn
      ?autofocus="${autofocus}"
      ?disabled="${disabled}"
      download="${ifDefined(download)}"
      href="${ifDefined(href)}"
      hreflang="${ifDefined(hreflang)}"
      kind="${ifDefined(kind)}"
      ping="${ifDefined(ping)}"
      rel="${ifDefined(rel)}"
      ?small="${small}"
      target="${ifDefined(target)}"
      type="${ifDefined(type)}"
    ></bx-btn>
  `;

describe('a11y compliance of bx-btn', function() {
  const container = document.getElementById('html-fragment-container');
  const formContainer = document.getElementById('form-html-fragment-container');

  it('Should be a11y compliant with minimum attributes for <button>', async function() {
    render(template(), formContainer!);
    await Promise.resolve();
    await testAATCompliance(formContainer!, 'bx-button: <button> with minimum attributes');
  });

  it('Should be a11y compliant with various attributes for <button>', async function() {
    render(
      template({
        autofocus: true,
        disabled: true,
        kind: BUTTON_KIND.SECONDARY,
        small: true,
        type: 'submit',
      }),
      formContainer!
    );
    await Promise.resolve();
    await testAATCompliance(formContainer!, 'bx-button: <button> with various attributes');
  });

  it('Should be a11y compliant with minimum attributes for <a>', async function() {
    render(template({ href: 'about:blank' }), container!);
    await Promise.resolve();
    await testAATCompliance(container!, 'bx-button: <a> with minimum attributes');
  });

  it('Should be a11y compliant with various attributes for <a>', async function() {
    render(
      template({
        disabled: true,
        download: 'file-name-foo',
        href: 'about:blank',
        hreflang: 'en',
        kind: BUTTON_KIND.SECONDARY,
        ping: 'about:blank',
        rel: 'noopener',
        small: true,
        target: '_blank',
        type: 'text/plain',
      }),
      container!
    );
    await Promise.resolve();
    await testAATCompliance(container!, 'bx-button: <a> with various attributes');
  });

  afterEach(function() {
    render(undefined!, formContainer!);
    render(undefined!, container!);
  });
});
