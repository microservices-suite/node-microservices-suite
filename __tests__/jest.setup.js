// Mock process.exit to prevent tests from exiting
const originalExit = process.exit;
const originalChdir = process.chdir;

process.exit = jest.fn((code) => {
  throw new Error(`process.exit(${code}) was called`);
});

process.chdir = jest.fn();

// Mock console for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  process.exit.mockClear();
  process.chdir.mockClear();
});

// Restore console and process.exit after all tests
afterAll(() => {
  jest.restoreAllMocks();
  process.exit = originalExit;
  process.chdir = originalChdir;
});