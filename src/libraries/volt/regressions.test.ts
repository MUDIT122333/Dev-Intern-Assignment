import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { VOLT_CODEGEN } from './composer/codegen';

const repo = (...parts: string[]) => join(process.cwd(), ...parts);

describe('Volt assignment regressions', () => {
  it('uses the canonical selected border token in StationListCard CSS', () => {
    const css = readFileSync(
      repo('src/components/molecules/molecules.css'),
      'utf8',
    );

    expect(css).toContain('var(--ev-card-selected-border)');
    expect(css).not.toContain('var(--ev-card-selected-boder)');
  });

  it('keeps the Station detail tariff import resolvable', () => {
    expect(
      readFileSync(
        repo('src/libraries/volt/components/tariffs.ts'),
        'utf8',
      ),
    ).toContain(
      "export { SAMPLE_TARIFF_NOTES } from '../../../components/tariffs';",
    );

    expect(VOLT_CODEGEN.fixtures.SAMPLE_TARIFF_NOTES).toBe(
      '../components/tariffs',
    );
  });
});