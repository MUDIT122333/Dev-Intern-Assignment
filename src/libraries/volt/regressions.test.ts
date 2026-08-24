import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { VOLT_COMPAT_TOKENS } from './tokens/compat';
import { VOLT_CODEGEN } from './composer/codegen';

const repo = (...parts: string[]) => join(process.cwd(), ...parts);

describe('Volt assignment regressions', () => {
  it('provides the token consumed by StationListCard selected CSS', () => {
    expect(VOLT_COMPAT_TOKENS.tokens).toContainEqual({
      path: 'card.selected-boder',
      type: 'color',
      alias: { layer: 'component', path: 'card.selected-border' },
    });
  });

  it('keeps the Station detail tariff import resolvable', () => {
    expect(readFileSync(repo('src/libraries/volt/components/tariffs.ts'), 'utf8'))
      .toContain("export { SAMPLE_TARIFF_NOTES } from '../../../components/tariffs';");
    expect(VOLT_CODEGEN.fixtures.SAMPLE_TARIFF_NOTES).toBe('../components/tariffs');
  });
});
