module.exports = {
  sync: jest.fn((pattern, options) => ['/path/to/file1', '/path/to/file2']),
  glob: jest.fn((pattern, options, callback) => {
    if (callback) callback(null, ['/path/to/file1', '/path/to/file2']);
  }),
  Glob: jest.fn(function(pattern, options) {
    this.found = ['/path/to/file1', '/path/to/file2'];
    return this;
  }),
};