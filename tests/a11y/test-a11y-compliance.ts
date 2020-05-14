/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import shouldIssueBeIgnoredGlobal from './global-ignore-aat-issues';

/**
 * AAT issue message.
 */
interface AATIssueMessages {
  /**
   * The error messages.
   */
  messages: { [messegeCode: string]: string };

  /**
   * The language of the messages.
   */
  lang: string;
}

/**
 * AAT issue.
 */
interface AATIssue {
  /**
   * The severity code.
   */
  severityCode: string;

  /**
   * The mssage code.
   */
  messageCode: string;

  /**
   * The rule ID that caused this issue.
   */
  ruleId: string;

  /**
   * The HTML file name for the help.
   */
  help: string;

  /**
   * The additional info of this issue.
   */
  msgArgs: Object[];

  /**
   * The bounds in the viewport of this issue.
   */
  bounds: { left: number; top: number; height: number; width: number };

  /**
   * The error level of this issue.
   */
  level: string;

  /**
   * The XPath of the element causing this issue.
   */
  xpath: string;

  /**
   * The code snippet of this element causing this issue.
   */
  snippet: string;

  /**
   * `true` if this issue is ignored.
   */
  ignored: boolean;
}

/**
 * AAT issue report for a frame.
 */
interface AATIssuesReport {
  /**
   * The frame index.
   */
  frameIdx: number;

  /**
   * The title of the frame (document).
   */
  frameTitle: string;

  /**
   * The issues.
   */
  issues: AATIssue[];
}

/**
 * AAT issues summary.
 */
interface AATIssuesSummary {
  /**
   * The counts of different types of issues.
   */
  counts: { [issueType: string]: number };

  /**
   * The rulesets.
   */
  policies: string[];

  /**
   * The issue levels to report.
   */
  reportLevels: string[];

  /**
   * The timestamp of when the scan started.
   */
  startScan: number;
}

interface AATResults {
  /**
   * The issue messages.
   */
  issueMessages: AATIssueMessages;

  /**
   * The ID of the scan.
   */
  scanID: string;

  /**
   * The ID of the tool used for the scan.
   */
  toolID: string;

  /**
   * The label to identify tests.
   */
  label: string;

  /**
   * The issues summary.
   */
  summary: AATIssuesSummary;

  /**
   * AAT issue reports.
   */
  reports: AATIssuesReport[];
}

declare namespace AAT {
  const getCompliance: (content: Element | string, filename: string, callback: (results: AATResults) => void) => void;
  const assertCompliance: (results: AATResults) => number;
}

export default async function testAATCompliance(content: Element, filename: string, shouldIssueBeIgnored?: boolean) {
  const doc = content.ownerDocument;
  const filterFuncs: ((issue: Object, elem: Element) => boolean)[] = [];
  if (typeof shouldIssueBeIgnored === 'function') {
    filterFuncs.push(shouldIssueBeIgnored);
  }
  filterFuncs.push(shouldIssueBeIgnoredGlobal);
  const results = await new Promise<AATResults>(resolve => {
    AAT.getCompliance(content, filename, resolve);
  });
  const code = AAT.assertCompliance(results);
  (content.ownerDocument!.documentElement as any).EXT_SCANNED = false;
  if (code !== 0) {
    const issues = results.reports
      .reduce(
        (cumulated, report) => {
          cumulated.push(...report.issues);
          return cumulated;
        },
        [] as AATIssue[]
      )
      .filter(
        filterFuncs.length === 0
          ? () => true
          : issue => {
              const elem = doc && doc.evaluate(issue.xpath, doc, null, XPathResult.ANY_TYPE, null).iterateNext();
              return !filterFuncs.some(filterFunc => filterFunc(issue, elem as Element));
            }
      );
    if (issues.length > 0) {
      throw new Error(`a11y compliance test failed. Code: ${code}, Details:\n${JSON.stringify(issues, null, 2)}`);
    }
  }
}
