/**
 * This funtion takes a discreption and a callback that resolves to jest expect suite aka matchers
 * @test keyword that tells jest this is a testable function otherwise jest will skip it during tests
 * @expect {func} returns an expection object
 */
test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });