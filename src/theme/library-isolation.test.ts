import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');

describe('theme isolation across UI libraries', () => {
  it('remounts the playground ThemeProvider per library', () => {
    expect(read('src/main.tsx')).toMatch(/<ThemeProvider\s+key=\{library\.id\}/);
  });

  it('remounts the composer ThemeProvider per library', () => {
    expect(read('src/composer/main.tsx')).toMatch(/<ThemeProvider\s+key=\{library\.id\}/);
  });

  it('uses the library-specific persistence key in both entry points', () => {
    expect(read('src/main.tsx')).toContain('storageKey={`prism-ui-theme:${library.id}`}');
    expect(read('src/composer/main.tsx')).toContain('storageKey={`prism-ui-theme:${library.id}`}');
  });
});
