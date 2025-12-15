module.exports = {
  existsSync: jest.fn(() => true),
  statSync: jest.fn(() => ({ isDirectory: jest.fn(() => true) })),
  readdirSync: jest.fn(() => []),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
  rmSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFile: jest.fn((path, content, callback) => {
    if (callback) callback(null);
  }),
  readFile: jest.fn((path, options, callback) => {
    if (callback) callback(null, '{}');
  }),
};