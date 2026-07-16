// [vendor] AlignUI — copiado de la DOCUMENTACIÓN PÚBLICA (alignui.com/docs/v1.2/ui/accordion,
// 2026-07-16, PLAN-ALIGNUI.md): los templates Pro locales no traen accordion.tsx.
// Únicos cambios: rutas de import + port de sintaxis Tailwind v3→v4 en 2 clases
// (theme(space.7)→1.75rem — v4 retiró theme() de los valores arbitrarios;
// grid-cols-[auto,minmax(0,1fr)]→[auto_minmax(0,1fr)] — separador de v4) y los
// keyframes accordion-up/down viven en styles/alignui.css (en v3 salían del
// tailwind.config del vendor). NO editar a mano — personalizar via className
// (cerebro synexia-health: «override sin tocar el vendor»).
// AlignUI Accordion v0.0.0

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { RiAddLine, RiSubtractLine } from '@remixicon/react';

import { cn } from '@/lib/alignui/cn';
import type { PolymorphicComponentProps } from '@/lib/alignui/polymorphic';

const ACCORDION_ITEM_NAME = 'AccordionItem';
const ACCORDION_ICON_NAME = 'AccordionIcon';
const ACCORDION_ARROW_NAME = 'AccordionArrow';
const ACCORDION_TRIGGER_NAME = 'AccordionTrigger';
const ACCORDION_CONTENT_NAME = 'AccordionContent';

const AccordionRoot = AccordionPrimitive.Root;
const AccordionHeader = AccordionPrimitive.Header;

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <AccordionPrimitive.Item
      ref={forwardedRef}
      className={cn(
        'group/accordion',
        'rounded-10 bg-bg-white-0 p-3.5 ring-1 ring-inset ring-stroke-soft-200',
        'transition duration-200 ease-out',
        'hover:bg-bg-weak-50 hover:ring-transparent',
        'has-[:focus-visible]:bg-bg-weak-50 has-[:focus-visible]:ring-transparent',
        'data-[state=open]:bg-bg-weak-50 data-[state=open]:ring-transparent',
        className,
      )}
      {...rest}
    />
  );
});
AccordionItem.displayName = ACCORDION_ITEM_NAME;

const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ children, className, ...rest }, forwardedRef) => {
  return (
    <AccordionPrimitive.Trigger
      ref={forwardedRef}
      className={cn(
        'w-[calc(100%+1.75rem)] text-left text-label-sm text-text-strong-950',
        'grid auto-cols-auto grid-flow-col grid-cols-[auto_minmax(0,1fr)] items-center gap-2.5',
        '-m-3.5 p-3.5 outline-none',
        'focus:outline-none',
        className,
      )}
      {...rest}
    >
      {children}
    </AccordionPrimitive.Trigger>
  );
});
AccordionTrigger.displayName = ACCORDION_TRIGGER_NAME;

function AccordionIcon<T extends React.ElementType>({
  className,
  as,
  ...rest
}: PolymorphicComponentProps<T>) {
  const Component = as || 'div';

  return (
    <Component
      className={cn('size-5 text-text-sub-600', className)}
      {...rest}
    />
  );
}
AccordionIcon.displayName = ACCORDION_ICON_NAME;

type AccordionArrowProps = React.HTMLAttributes<HTMLDivElement> & {
  openIcon?: React.ElementType;
  closeIcon?: React.ElementType;
};

function AccordionArrow({
  className,
  openIcon: OpenIcon = RiAddLine,
  closeIcon: CloseIcon = RiSubtractLine,
  ...rest
}: AccordionArrowProps) {
  return (
    <>
      <OpenIcon
        className={cn(
          'size-5 text-text-soft-400',
          'transition duration-200 ease-out',
          'group-hover/accordion:text-text-sub-600',
          'group-data-[state=open]/accordion:hidden',
          className,
        )}
        {...rest}
      />
      <CloseIcon
        className={cn(
          'size-5 text-text-sub-600',
          'hidden group-data-[state=open]/accordion:block',
          className,
        )}
        {...rest}
      />
    </>
  );
}
AccordionArrow.displayName = ACCORDION_ARROW_NAME;

const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ children, className, ...rest }, forwardedRef) => {
  return (
    <AccordionPrimitive.Content
      ref={forwardedRef}
      className='overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
      {...rest}
    >
      <div
        className={cn('pt-1.5 text-paragraph-sm text-text-sub-600', className)}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
});
AccordionContent.displayName = ACCORDION_CONTENT_NAME;

export {
  AccordionRoot as Root,
  AccordionHeader as Header,
  AccordionItem as Item,
  AccordionTrigger as Trigger,
  AccordionIcon as Icon,
  AccordionArrow as Arrow,
  AccordionContent as Content,
};
