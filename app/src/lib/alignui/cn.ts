// [vendor] AlignUI Pro — copiado de Synexia/referencia-alignui/finance (2026-07-16, PLAN-ALIGNUI.md).
// Únicos cambios: rutas de import Y este archivo es el único con divergencia real:
// el original saca las claves de su tailwind.config.ts (Tailwind v3); Hispaniola es
// Tailwind v4 (@theme CSS-first, styles/alignui.css) y no hay config JS que importar,
// así que las claves van literales. Si se añade un text/shadow/radius del sistema
// AlignUI en alignui.css, su clave se añade AQUÍ también — si no, tailwind-merge no
// sabrá que `text-label-sm` y `text-h2` compiten y dejará las dos clases en el DOM.
// No editar nada más a mano — personalizar via className/wrappers
// (patrón del cerebro synexia-health: «override de AlignUI sin tocar el vendor»).
import clsx, { type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

export { type ClassValue } from 'clsx';

// Espejo de las claves de texts/shadows/borderRadii del tailwind.config del vendor.
const texts = [
  'title-h1', 'title-h2', 'title-h3', 'title-h4', 'title-h5', 'title-h6',
  'label-xl', 'label-lg', 'label-md', 'label-sm', 'label-xs',
  'paragraph-xl', 'paragraph-lg', 'paragraph-md', 'paragraph-sm', 'paragraph-xs',
  'subheading-md', 'subheading-sm', 'subheading-xs', 'subheading-2xs',
  'doc-label', 'doc-paragraph',
];
const shadows = [
  'regular-xs', 'regular-sm', 'regular-md',
  'button-primary-focus', 'button-important-focus', 'button-error-focus',
  'fancy-buttons-neutral', 'fancy-buttons-primary', 'fancy-buttons-error', 'fancy-buttons-stroke',
  'toggle-switch', 'switch-thumb', 'tooltip',
];
const borderRadii = ['10', '20'];

export const twMergeConfig = {
  extend: {
    classGroups: {
      'font-size': [
        {
          text: texts,
        },
      ],
      shadow: [
        {
          shadow: shadows,
        },
      ],
      rounded: [
        {
          rounded: borderRadii,
        },
      ],
    },
  },
};

const customTwMerge = extendTailwindMerge(twMergeConfig);

/**
 * Utilizes `clsx` with `tailwind-merge`, use in cases of possible class conflicts.
 */
export function cnExt(...classes: ClassValue[]) {
  return customTwMerge(clsx(...classes));
}

/**
 * A direct export of `clsx` without `tailwind-merge`.
 */
export const cn = clsx;
