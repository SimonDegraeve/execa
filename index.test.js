const execa = require('execa');

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
    execa.__setMockResults(['stdout']);
    return execa('echo', ['ok']).then(result =>
      expect(result).toEqual({
        stdout: 'stdout',
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
    execa.__setMockResults([['stdout']]);
    return execa('echo', ['ok']).then(result =>
      expect(result).toEqual({
        stdout: 'stdout',
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
    execa.__setMockResults([['stdout', 2]]);
    return execa('echo', ['ok']).catch(error => {
      expect(error.message).toMatch(/Command failed: echo ok/);
      expect(error.stdout).toMatch(/stdout/);
      expect(error.stderr).toBe('\n');
      expect(error.code).toBe(2);
    });
  });

  it('works with results as array with error and error output', () => {
    execa.__setMockResults([['stdout', 'stderr', 2]]);
    return execa('echo', ['ok']).catch(error => {
      expect(error.message).toMatch(/Command failed: echo ok/);
      expect(error.stdout).toMatch(/stdout/);
      expect(error.stderr).toMatch(/stderr/);
      expect(error.code).toBe(2);
    });
  });

  it('works with results as object', () => {
    execa.__setMockResults([{ stdout: 'stdout', stderr: 'stderr', code: 2 }]);
    return execa('echo', ['ok']).catch(error => {
      expect(error.message).toMatch(/Command failed: echo ok/);
      expect(error.stdout).toMatch(/stdout/);
      expect(error.stderr).toMatch(/stderr/);
      expect(error.code).toBe(2);
    });
  });

  it('spies on methods', () => {
    return execa.stdout('echo', ['ok']).then(() => {
      expect(execa).toHaveBeenLastCalledWith('echo', ['ok']);
    });
  });

  it('cache the results', () => {
    execa.__setMockResults(['stdout']);
  });

  it('flush the results between tests', () => {
    return execa('echo', ['ok']).then(result =>
      expect(result.stdout).toBe('')
    );
  });
});
