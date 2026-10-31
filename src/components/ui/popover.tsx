'use client';
import { Popover as Primitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
export const Popover = Primitive.Root;
export const PopoverTrigger = Primitive.Trigger;
export const PopoverContent = ({
  className,
  ...props
}: ComponentProps<typeof Primitive.Content>) => (
  <Primitive.Portal>
    <Primitive.Content
      sideOffset={8}
      align="start"
      className={cn(
        'z-50 max-h-[70dvh] w-80 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl bg-popover p-4 text-popover-foreground shadow-floating outline-none',
        className,
      )}
      {...props}
    />
  </Primitive.Portal>
);
