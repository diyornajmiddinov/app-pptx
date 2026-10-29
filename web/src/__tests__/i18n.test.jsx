import { describe, expect, it } from 'vitest';
import { MESSAGES, pathLang } from '../i18n.jsx';

describe('i18n', () => {
  it('takes the language from /ru/ and /en/ paths only', () => {
    expect(pathLang('/ru/')).toBe('ru');
    expect(pathLang('/en')).toBe('en');
    expect(pathLang('/')).toBe(null);
    expect(pathLang('/russia')).toBe(null);
  });

  it('has every text in all three languages', () => {
    const keys = (l) => Object.keys(MESSAGES[l]).sort();
    expect(keys('ru')).toEqual(keys('uz'));
    expect(keys('en')).toEqual(keys('uz'));
  });
});
