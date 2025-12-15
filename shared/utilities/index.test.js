const { sum, multiply } = require('./index');

test('sum function adds numbers correctly', () => {
	expect(sum(1, 2)).toBe(3);
	expect(sum(-1, 1)).toBe(0);
});

test('multiply function multiplies numbers correctly', () => {
	expect(multiply(2, 3)).toBe(6);
	expect(multiply(-1, 1)).toBe(-1);
});