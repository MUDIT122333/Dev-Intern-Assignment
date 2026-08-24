import type { TokenLayerDef } from '../../../tokens/types';

/** Compatibility alias for the legacy StationListCard CSS token spelling. */
export const VOLT_COMPAT_TOKENS: TokenLayerDef = {
  layer: 'component',
  tokens: [
    {
      path: 'card.selected-boder',
      type: 'color',
      alias: { layer: 'component', path: 'card.selected-border' },
    },
  ],
};
