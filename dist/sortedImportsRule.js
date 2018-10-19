"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (C) 2017 Rimeto, LLC. All Rights Reserved.
var _ = require("lodash");
var Lint = require("tslint");
var ts = require("typescript");
// tslint:disable:max-classes-per-file

var Rule = function (_Lint$Rules$AbstractR) {
    _inherits(Rule, _Lint$Rules$AbstractR);

    function Rule() {
        _classCallCheck(this, Rule);

        return _possibleConstructorReturn(this, (Rule.__proto__ || Object.getPrototypeOf(Rule)).apply(this, arguments));
    }

    _createClass(Rule, [{
        key: "apply",
        value: function apply(sourceFile) {
            return this.applyWithWalker(new SortedImportsWalker(sourceFile, this.getOptions()));
        }
    }]);

    return Rule;
}(Lint.Rules.AbstractRule);

Rule.metadata = {
    ruleName: 'sorted-imports',
    description: 'Requires that import statements be sorted by name',
    hasFix: true,
    options: {},
    optionsDescription: 'None',
    type: 'style',
    typescriptOnly: false
};
Rule.IMPORT_SOURCES_UNORDERED = 'Import sources within group must be sorted by name.';
exports.Rule = Rule;

var SortedImportsWalker = function (_Lint$RuleWalker) {
    _inherits(SortedImportsWalker, _Lint$RuleWalker);

    function SortedImportsWalker(sourceFile, options) {
        _classCallCheck(this, SortedImportsWalker);

        var _this2 = _possibleConstructorReturn(this, (SortedImportsWalker.__proto__ || Object.getPrototypeOf(SortedImportsWalker)).call(this, sourceFile, options));

        _this2._currentImportsGroup = new Map();
        return _this2;
    }

    _createClass(SortedImportsWalker, [{
        key: "walk",
        value: function walk(sourceFile) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = sourceFile.statements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var statement = _step.value;

                    if (ts.isImportDeclaration(statement)) {
                        this._processImportDeclaration(statement);
                    } else {
                        this._endCurrentImportsGroup();
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this._endCurrentImportsGroup();
        }
    }, {
        key: "_processImportDeclaration",
        value: function _processImportDeclaration(node) {
            if (/\r?\n\r?\n/.test(node.getFullText())) {
                this._endCurrentImportsGroup();
            }
            if (ts.isStringLiteral(node.moduleSpecifier) && node.importClause) {
                this._currentImportsGroup.set(node.importClause.getText().replace(/\r?\n/g, '').replace(/\s\s+/, ' '), node);
            }
        }
    }, {
        key: "_endCurrentImportsGroup",
        value: function _endCurrentImportsGroup() {
            if (!this._currentImportsGroup.size) {
                return;
            }
            var importTuples = [].concat(_toConsumableArray(this._currentImportsGroup.entries()));
            this._currentImportsGroup.clear();
            // Case-insensitive alphabetizer
            var sorted = _.sortBy(importTuples, function (_ref) {
                var _ref2 = _slicedToArray(_ref, 1),
                    key = _ref2[0];

                return key.toLocaleLowerCase();
            });
            if (_.isEqual(importTuples, sorted)) {
                return;
            }
            // Re-write the import group
            var fixedImportGroupText = sorted.map(function (_ref3) {
                var _ref4 = _slicedToArray(_ref3, 2),
                    node = _ref4[1];

                return node.getText();
            }).join('\n');
            var start = importTuples[0][1].getStart();
            var end = importTuples[importTuples.length - 1][1].getEnd();
            this.addFailure(this.createFailure(start, end - start, Rule.IMPORT_SOURCES_UNORDERED, Lint.Replacement.replaceFromTo(start, end, fixedImportGroupText)));
        }
    }]);

    return SortedImportsWalker;
}(Lint.RuleWalker);