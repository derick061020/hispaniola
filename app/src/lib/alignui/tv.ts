// [vendor] AlignUI Pro — copiado de Synexia/referencia-alignui/finance (2026-07-16, PLAN-ALIGNUI.md).
// Únicos cambios: rutas de import. NO editar a mano — personalizar via className/wrappers
// (patrón del cerebro synexia-health: «override de AlignUI sin tocar el vendor»).
import { createTV } from 'tailwind-variants';

import { twMergeConfig } from '@/lib/alignui/cn';

export type { VariantProps, ClassValue } from 'tailwind-variants';

export const tv = createTV({
  twMergeConfig,
});
