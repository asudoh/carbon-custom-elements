/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

(() => {
  const contextHtml = `<style id="offleft-style" type="text/css">
    .offleft {
      position: absolute;
      top: 0;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    }
  </style>
  <div role="main">
    <a class="offleft" href="#maincontent">Skip to main content</a>
    <a name="maincontent"></a>
    <div id="html-fragment-container"></div>
    <form>
      <fieldset data-invalid class="bx--form__fieldset">
        <legend class="bx--form__legend">Dummy legend for g497</legend>
        <div id="form-html-fragment-container"></div>
      </fieldset>
      <button class="bx--btn" type="submit">Submit</button><!-- Dummy submit button for g324 -->
    </form>
  </div>`;

  // Use Shady DOM polyfill until `karma-ibma` can scan shadow DOM contents
  (window as any).ShadyDOM = { force: true };

  document.title = 'Karma runner context';
  document.documentElement.setAttribute('lang', 'en');
  document.body.insertAdjacentHTML('afterbegin', contextHtml);
})();
