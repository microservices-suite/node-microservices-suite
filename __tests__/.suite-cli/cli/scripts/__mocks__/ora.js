const { EventEmitter } = require('events');

class MockOra extends EventEmitter {
  constructor(message) {
    super();
    this.message = message;
    this.color = 'blue';
    this.isSpinning = false;
  }

  start() {
    this.isSpinning = true;
    return this;
  }

  succeed(message) {
    this.message = message || this.message;
    this.isSpinning = false;
    return this;
  }

  fail(message) {
    this.message = message || this.message;
    this.isSpinning = false;
    return this;
  }

  warn(message) {
    this.message = message || this.message;
    this.isSpinning = false;
    return this;
  }

  info(message) {
    this.message = message || this.message;
    this.isSpinning = false;
    return this;
  }

  stop() {
    this.isSpinning = false;
    return this;
  }

  clear() {
    return this;
  }

  render() {
    return this;
  }

  frame() {
    return '⠋';
  }

  set text(message) {
    this.message = message;
  }

  get text() {
    return this.message;
  }

  set prefixText(text) {
    this.prefixText = text;
  }

  get prefixText() {
    return this.prefixText || '';
  }

  set spinner(spinner) {
    this.spinner = spinner;
  }

  get spinner() {
    return this.spinner || { frames: ['⠋'] };
  }
}

module.exports = jest.fn((message) => new MockOra(message));
module.exports.promise = jest.fn((promise, message) => promise);