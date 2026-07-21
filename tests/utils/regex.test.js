const { escapeRegex } = require('../../utils/regex');

describe('escapeRegex', () => {
  it('escapes regex metacharacters', () => {
    expect(escapeRegex('a.b*c')).toBe('a\\.b\\*c');
  });

  it('neutralizes a catastrophic-backtracking pattern instead of compiling it as regex', () => {
    const malicious = '(a+)+$';
    const escaped = escapeRegex(malicious);
    const re = new RegExp('^' + escaped + '$', 'i');

    // Matches only the literal string, not a nested-quantifier regex —
    // this is the fix for the getPublicSchool ReDoS finding.
    expect(re.test('(a+)+$')).toBe(true);
    expect(re.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!')).toBe(false);
  });

  it('leaves hyphens untouched so slug-to-regex matching still works', () => {
    expect(escapeRegex('some-school-name')).toBe('some-school-name');
  });
});
