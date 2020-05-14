/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const shouldIssueBeIgnoredForRule = {
  // Rule needed for <IE8 only
  'haac.g1124.InputHasRequired': true,
  // Issue# 232 in our tools repo
  'rpt.g1.styleTrigger': true,
  // The rule implementation doesn't seem to detect non-attribute keyboard event handler
  'wcag20.tech.aria.MissingKeyboardHandler': true,
  // Issue# 233 in our tools repo
  'wcag20.tech.h59.linkValid': elem => /\.css\?/i.test(elem.getAttribute('href')),
  // Issue# 387 in our tools repo
  'wcag20.g1069.styleBeforeAfter': elem => {
    if (elem.tagName === 'LINK' && /^stylesheet$/i.test(elem.getAttribute('rel')) && !/^\s*$/.test(elem.getAttribute('rel'))) {
      return Array.prototype.filter
        .call(elem.ownerDocument.styleSheets, sheet => sheet.ownerNode === elem)
        .every(sheet => {
          // eslint-disable-next-line arrow-body-style
          const testNonePseudoContent = rule => {
            return (
              !/:(before|after)/i.test(rule.selectorText) ||
              /^none$/i.test(rule.style.content) ||
              /^attr\(.+\)$/i.test(rule.style.content) ||
              // We should make sure we have alternate way of conveying:
              // - required field (*)
              // - list item (-)
              // - activity log item (filled circle)
              // NOTE: PhantomJS keeps surrounding singlequotes in rule.style.content
              /^\s*([*\-\u2022]|['"]\s*[*\-\u2022]?\s*['"])\s*$/i.test(rule.style.content) ||
              /^\s*$/.test(rule.style.content)
            );
          };
          return Array.prototype.every.call(sheet.cssRules, testNonePseudoContent);
        });
    }
    return undefined;
  },
};

const shouldIssueBeIgnoredForAnyRule = elem => elem.matches('style[scope]'); // `<style>` created by ShadyDOM

export default function shouldIssueBeIgnored(issue, elem) {
  return [shouldIssueBeIgnoredForAnyRule, shouldIssueBeIgnoredForRule[issue.messageCode]].some(test =>
    typeof test === 'function' ? test(elem) : test
  );
}
