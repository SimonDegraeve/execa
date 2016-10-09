const execa = require('execa')

describe('Mock', () => {
  it('works with no results', () => {
    return execa('echo', ['ok']).then(result =>
      expect(result).toEqual({
        stdout: '',
        stderr: '',
        code: 0,
        failed: false,
        killed: false,
        signal: null,
        cmd: 'echo ok'
      })
    );
  });

  it('works with results as string', () => {
    execa.__setMockResults(['ok'])
    return execa('echo', ['ok']).then(result =>
      expect(result).toEqual({
        stdout: 'ok',
        stderr: '',
        code: 0,
        failed: false,
        killed: false,
        signal: null,
        cmd: 'echo ok'
      })
    );
  });

  it('works with results as array', () => {
    execa.__setMockResults([['ok']])
    return execa('echo', ['ok']).then(result =>
      expect(result).toEqual({
        stdout: 'ok',
        stderr: '',
        code: 0,
        failed: false,
        killed: false,
        signal: null,
        cmd: 'echo ok'
      })
    );
  });

  it('works with results as array with error', () => {
    execa.__setMockResults([['ok', 2]])
    return execa('echo', ['ok']).catch(error => {
      expect(error.message).toMatch(/Command failed: echo ok/);
      expect(error.stdout).toMatch(/ok/);
      expect(error.stderr).toBe('\n');
      expect(error.code).toBe(2);
    });
  });

  it('works with results as array with error and error output', () => {
    execa.__setMockResults([['ok', 'not ok', 2]])
    return execa('echo', ['ok']).catch(error => {
      expect(error.message).toMatch(/Command failed: echo ok/);
      expect(error.stdout).toMatch(/ok/);
      expect(error.stderr).toMatch(/not ok/);
      expect(error.code).toBe(2);
    });
  });

  it('works with results as object', () => {
    execa.__setMockResults([{ stdout: 'ok', stderr: 'not ok', code: 2}])
    return execa('echo', ['ok']).catch(error => {
      expect(error.message).toMatch(/Command failed: echo ok/);
      expect(error.stdout).toMatch(/ok/);
      expect(error.stderr).toMatch(/not ok/);
      expect(error.code).toBe(2);
    });
  });

  it('spies on methods', () => {
    return execa.stdout('echo', ['ok']).then(() => {
      expect(execa).toHaveBeenLastCalledWith('echo', ['ok']);
    });
  });

  it('cache the results', () => {
    execa.__setMockResults(['ok']);
  });

  it('flush the results between tests', () => {
    return execa('echo', ['ok']).then(result =>
      expect(result.stdout).toBe('')
    );
  });
});
