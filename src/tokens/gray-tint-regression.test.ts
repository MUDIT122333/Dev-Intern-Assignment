import { describe, expect, it } from 'vitest';
import { buildSemanticTokens } from './brand';
import type { BrandDefinition } from './brand';

const base: BrandDefinition = {
  name: 'Volt',
  accentHex: '#00c16a',
  grayTint: 'gray',
  radius: 'large',
  scaling: 1,
  fontFamily: 'system-ui, sans-serif',
  panelStyle: 'translucent',
};

describe('gray tint generation', () => {
  it('preserves the selected Radix gray family instead of collapsing every tint to neutral gray', () => {
    const tints: BrandDefinition['grayTint'][] = ['gray', 'mauve', 'slate', 'sage', 'olive', 'sand'];
    const step9 = tints.map((grayTint) => {
      const semantic = buildSemanticTokens({ ...base, grayTint });
      return semantic.tokens.find((token) => token.path === 'gray.9')!.modes!.light;
    });
    expect(new Set(step9).size).toBe(tints.length);
  });
});
