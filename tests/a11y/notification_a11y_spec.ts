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
import { NOTIFICATION_KIND } from '../../src/components/notification/inline-notification';

const template = ({
  closeButtonLabel,
  hideCloseButton,
  iconLabel,
  kind,
  open,
  subtitle,
  title,
}: {
  closeButtonLabel?: string;
  hideCloseButton?: boolean;
  iconLabel?: string;
  kind?: NOTIFICATION_KIND;
  open?: boolean;
  subtitle?: string;
  title?: string;
} = {}) =>
  html`
    <bx-inline-notification
      close-button-label="${ifDefined(closeButtonLabel)}"
      ?hide-close-button="${ifDefined(hideCloseButton)}"
      icon-label="${ifDefined(iconLabel)}"
      kind="${ifDefined(kind)}"
      ?open="${ifDefined(open)}"
      subtitle="${ifDefined(subtitle)}"
      title="${ifDefined(title)}"
    ></bx-inline-notification>
  `;

describe('a11y compliance of bx-inline-notification', function() {
  const container = document.getElementById('html-fragment-container');

  it('Should be a11y compliant with minimum attributes', async function() {
    render(template(), container!);
    await Promise.resolve();
    await testAATCompliance(container!, 'bx-inline-notification: Minimum attributes');
  });

  it('Should be a11y compliant with various attributes', async function() {
    render(
      template({
        closeButtonLabel: 'close-button-label-foo',
        hideCloseButton: true,
        iconLabel: 'icon-label-foo',
        kind: NOTIFICATION_KIND.INFO,
        open: false,
        subtitle: 'subtitle-foo',
        title: 'title-foo',
      }),
      container!
    );
    await Promise.resolve();
    await testAATCompliance(container!, 'bx-inline-notification: Various attributes');
  });

  afterEach(function() {
    render(undefined!, container!);
  });
});
