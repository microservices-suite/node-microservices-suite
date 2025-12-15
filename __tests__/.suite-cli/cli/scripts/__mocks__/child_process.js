const { EventEmitter } = require('events');

class MockChild extends EventEmitter {
  constructor() {
    super();
    this.stdout = new EventEmitter();
    this.stderr = new EventEmitter();
  }
}

module.exports = {
  exec: jest.fn((command, options, callback) => {
    const child = new MockChild();
    if (callback) callback(null, '', '');
    return child;
  }),
  spawn: jest.fn((command, args, options) => {
    const child = new MockChild();
    return child;
  }),
};
