/**
 * Copyright (C) 2018-present, Rimeto, LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as _ from 'lodash';
import * as Lint from 'tslint';
import * as ts from 'typescript';


// tslint:disable:max-classes-per-file
export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'sorted-imports',
    description: 'Requires that import statements be sorted by name',
    hasFix: true,
    options: {},
    optionsDescription: 'None',
    type: 'style',
    typescriptOnly: false,
  };

  public static IMPORT_SOURCES_UNORDERED = 'Import sources within group must be sorted by name.';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new SortedImportsWalker(sourceFile, this.getOptions()));
  }
}

class SortedImportsWalker extends Lint.RuleWalker {
  private _currentImportsGroup: Map<string, ts.ImportDeclaration>;

  constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);
    this._currentImportsGroup = new Map();
  }

  public walk(sourceFile: ts.SourceFile): void {
    for (const statement of sourceFile.statements) {
      if (ts.isImportDeclaration(statement)) {
        this._processImportDeclaration(statement);
      } else {
        this._endCurrentImportsGroup();
      }
    }
    this._endCurrentImportsGroup();
  }

  private _processImportDeclaration(node: ts.ImportDeclaration): void {
    if (/\r?\n\r?\n/.test(node.getFullText())) {
      this._endCurrentImportsGroup();
    }

    if (ts.isStringLiteral(node.moduleSpecifier) && node.importClause) {
      this._currentImportsGroup.set(
        node.importClause
          .getText()
          .replace(/\r?\n/g, '')
          .replace(/\s\s+/, ' '),
        node,
      );
    }
  }

  private _endCurrentImportsGroup(): void {
    if (!this._currentImportsGroup.size) {
      return;
    }

    const importTuples = [...this._currentImportsGroup.entries()];
    this._currentImportsGroup.clear();

    // Case-insensitive alphabetizer
    const sorted = _.sortBy(importTuples, ([key]) => key.toLocaleLowerCase());
    if (_.isEqual(importTuples, sorted)) {
      return;
    }

    // Re-write the import group
    const fixedImportGroupText = sorted.map(([, node]) => node.getText()).join('\n');
    const start = importTuples[0][1].getStart();
    const end = importTuples[importTuples.length - 1][1].getEnd();
    this.addFailure(
      this.createFailure(
        start,
        end - start,
        Rule.IMPORT_SOURCES_UNORDERED,
        Lint.Replacement.replaceFromTo(start, end, fixedImportGroupText),
      ),
    );
  }
}
