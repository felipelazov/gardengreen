'use client';

import * as React from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function stripMask(value: string): string {
  return value.replace(/\D/g, '');
}

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onValueChange: (raw: string) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onValueChange, className, ...props }, ref) => {
    const display = applyPhoneMask(value);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const raw = stripMask(e.target.value);
      onValueChange(raw);
    }

    return (
      <div className="flex gap-2">
        <span className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">+55</span>
        <Input
          ref={ref}
          type="tel"
          value={display}
          onChange={handleChange}
          placeholder="(11) 99999-9999"
          className={cn(className)}
          {...props}
        />
      </div>
    );
  }
);
PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
