# tslint-rimeto

<br>

[TSLint](https://palantir.github.io/tslint/) rules used at Rimeto.

<br>

## Rules

### sorted-imports

Enforces a case-insensitive sort of imports within groups. Inclues an autofix for reordering imports to conform to the rule, distinquishing it from similar rules including `ordered-imports`.

## Usage

1) Install via yarn/npm: 

        yarn add --dev tslint

2) Configure your `tslint.json`  to extend `tslint-rimeto`, for example, 

        {
          "extends": ["tslint:latest" "tslint-rimeto"],
          "rules": { ...

3) Run `tslint` with `--fix` to autofix existing issues.


## License

tslint-rimeto is [MIT licensed](./LICENSE).
