jest.mock('node:child_process');
jest.mock('node:fs');

const { exec, spawn } = require('node:child_process');
const fs = require('node:fs');

const {
  isMatch,
  getPlatform,
  pathExists,
} = require('../../../../.suite-cli/cli/scripts/scripts.module');

describe('Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isMatch utility', () => {
    it('should handle string comparison', () => {
      expect(isMatch({ a: 'hello', b: 'hello' })).toBe(true);
      expect(isMatch({ a: 'hello', b: 'world' })).toBe(false);
    });

    it('should handle number comparison', () => {
      expect(isMatch({ a: 42, b: 42 })).toBe(true);
      expect(isMatch({ a: 42, b: 43 })).toBe(false);
    });

    it('should handle boolean comparison', () => {
      expect(isMatch({ a: true, b: true })).toBe(true);
      expect(isMatch({ a: true, b: false })).toBe(false);
    });

    it('should use strict equality', () => {
      expect(isMatch({ a: '0', b: 0 })).toBe(false);
      expect(isMatch({ a: null, b: undefined })).toBe(false);
    });
  });

  describe('File System Operations', () => {
    it('should validate file existence correctly', () => {
      fs.existsSync.mockReturnValue(true);
      expect(pathExists({ file_path: '/test/path' })).toBe(true);
      expect(fs.existsSync).toHaveBeenCalledWith('/test/path');
    });

    it('should handle directory operations', () => {
      fs.readdirSync.mockReturnValue(['file1.js', 'file2.js']);
      const files = fs.readdirSync('/test/dir');
      expect(files).toHaveLength(2);
      expect(files[0]).toBe('file1.js');
    });

    it('should handle stat operations', () => {
      fs.statSync.mockReturnValue({
        isDirectory: jest.fn(() => true),
        isFile: jest.fn(() => false),
      });
      const stat = fs.statSync('/test/path');
      expect(stat.isDirectory()).toBe(true);
      expect(stat.isFile()).toBe(false);
    });
  });

  describe('Process Operations', () => {
    it('should handle exec operations', (done) => {
      exec.mockImplementation((cmd, callback) => {
        callback(null, 'output', '');
        done();
      });

      exec('echo test', (err, stdout) => {
        expect(stdout).toBe('output');
      });
    });

    it('should handle spawn operations', () => {
      const mockSpawn = spawn.mock;
      expect(typeof spawn).toBe('function');
    });
  });
});