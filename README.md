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

## Examples

Autofixes unsorted input like,
        
        import * as Immutable from 'immutable';	
        import * as React from 'react';	
        import * as _ from 'lodash';	

        import RoutePath from '../../constants/RoutePath';
        import IAddress from '../../ifs/IAddress';

to be,

        import * as _ from 'lodash';
        import * as Immutable from 'immutable';
        import * as React from 'react';

        import IAddress from '../../ifs/IAddress';
        import RoutePath from '../../constants/RoutePath';

maintaining grouping and sorting within them.


## License

tslint-rimeto is [MIT licensed](./LICENSE).
