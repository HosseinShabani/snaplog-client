import * as React from 'react';
import { TextInput } from 'react-native';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput>
>(({ className, placeholderClassName, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      className={cn(
        'web:flex h-12 native:h-12 web:w-full rounded-xl border border-gray-20 bg-transparent px-4 web:py-2 typo-[16-400] native:text-lg native:leading-[1.25] text-black placeholder:text-gray-20 web:ring-offset-primary file:border-0 file:bg-transparent web:focus-visible:outline-none web:focus-visible:ring-0 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
        props.editable === false && 'opacity-50 web:cursor-not-allowed',
        className,
      )}
      placeholderClassName={cn('text-gray-20', placeholderClassName)}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
