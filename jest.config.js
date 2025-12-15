module.exports = {
  displayName: 'node-microservices-suite',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/jest.setup.js'],
  collectCoverageFrom: [
    '.suite-cli/cli/scripts/**/*.js',
    'shared/**/*.js',
    '!**/__tests__/**',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/*.test.js'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
    '/dist/'
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30
    }
  },
  testTimeout: 10000,
  verbose: true,
  moduleNameMapper: {
    '^@suite-cli/(.*)$': '<rootDir>/.suite-cli/cli/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1'
  }
};