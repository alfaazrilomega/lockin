"use client";

import * as React from "react";

interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function Checkbox({ 
  checked, 
  defaultChecked, 
  onCheckedChange, 
  className, 
  disabled, 
  ...props 
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false);
  const isControlled = checked !== undefined;
  const currentChecked = isControlled ? checked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onCheckedChange?.(newChecked);
  };

  return (
    <input
      type="checkbox"
      checked={currentChecked}
      onChange={handleChange}
      disabled={disabled}
      className={`h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      {...props}
    />
  );
}