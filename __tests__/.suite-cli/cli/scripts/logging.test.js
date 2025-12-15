jest.mock('chalk');

const {
  logTitle,
  logInfo,
  logError,
  logSuccess,
  logWarning,
  logAdvise,
} = require('../../../../.suite-cli/cli/scripts/scripts.module');

const chalk = require('chalk');

describe('Logging Functions', () => {
  beforeEach(() => {
    console.log = jest.fn();
    jest.clearAllMocks();
  });

  describe('logTitle', () => {
    it('should format message with grey color', () => {
      logTitle({ message: 'Title Message' });
      expect(chalk.grey).toHaveBeenCalledWith('Title Message');
      expect(console.log).toHaveBeenCalled();
    });

    it('should handle empty messages', () => {
      logTitle({ message: '' });
      expect(chalk.grey).toHaveBeenCalledWith('');
      expect(console.log).toHaveBeenCalled();
    });

    it('should handle special characters', () => {
      logTitle({ message: 'Title: @#$% Message' });
      expect(chalk.grey).toHaveBeenCalledWith('Title: @#$% Message');
    });
  });

  describe('logSuccess', () => {
    it('should format message with greenBright color and checkmark', () => {
      logSuccess({ message: 'Operation successful' });
      expect(chalk.greenBright).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
    });

    it('should include checkmark symbol', () => {
      logSuccess({ message: 'Done' });
      const call = chalk.greenBright.mock.calls[0][0];
      expect(call).toMatch(/✓/);
    });
  });

  describe('logError', () => {
    it('should format error with red color and warning symbol', () => {
      logError({ error: 'An error occurred' });
      expect(chalk.red).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
    });

    it('should include warning symbol', () => {
      logError({ error: 'Error' });
      const call = chalk.red.mock.calls[0][0];
      expect(call).toMatch(/⚠️/);
    });
  });

  describe('logInfo', () => {
    it('should format message with gray color', () => {
      logInfo({ message: 'Information' });
      expect(chalk.gray).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
    });

    it('should include checkmark symbol', () => {
      logInfo({ message: 'Info' });
      const call = chalk.gray.mock.calls[0][0];
      expect(call).toMatch(/✓/);
    });
  });

  describe('logWarning', () => {
    it('should format message with yellow color', () => {
      logWarning({ message: 'Warning message' });
      expect(chalk.yellow).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
    });

    it('should include checkmark symbol', () => {
      logWarning({ message: 'Warning' });
      const call = chalk.yellow.mock.calls[0][0];
      expect(call).toMatch(/✓/);
    });
  });

  describe('logAdvise', () => {
    it('should format message with stderr color', () => {
      logAdvise({ message: 'Advice' });
      expect(chalk.stderr).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
    });

    it('should include checkmark symbol', () => {
      logAdvise({ message: 'Advise' });
      const call = chalk.stderr.mock.calls[0][0];
      expect(call).toMatch(/✓/);
    });
  });
});