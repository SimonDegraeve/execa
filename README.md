# execa-mock-jest
> Mock execa for Jest

## Install

```
$ npm install --save execa-mock-jest
```

## Usage

Use as a [manual mock](https://facebook.github.io/jest/docs/manual-mocks.html):
```js
// __mocks__/execa.js
module.exports = require('execa-mock-jest');
```
```js
// something.test.js
const execa = require('execa');

it('mocks execa', () => {
  execa.__setMockResults([
    'Something has been removed'
    // Supports:
    //   'stdout'
    //   ['stdout', code]
    //   ['stdout', 'stderr', code]
    //   { stdout, stderr, code }
  ]);

  return execa('rm', ['*']).then(result =>
    expect(result).toEqual({
      stdout: 'Something has been removed',
      stderr: '',
      code: 0,
      failed: false,
      killed: false,
      signal: null,
      cmd: 'rm *'
    });
    expect(execa).toHaveBeenCalledTimes(1);
  );
});
```

## Nota Bene

Results order is not reliable when used with concurrent tests.
