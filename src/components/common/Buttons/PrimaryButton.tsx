'use client';
import { Button } from '@/components/ui/button';

interface PrimaryButtonProps {
  btnText: string;
  btnType: 'submit' | 'button';
  disabled: boolean;
}

export default function PrimaryButton({
  btnText,
  btnType,
  disabled,
}: PrimaryButtonProps) {
  return (
    <Button
      variant='default'
      size='default'
      type={btnType}
      disabled={disabled}
      className={`${
        disabled
          ? 'bg-gray-300'
          : 'border border-transparent bg-gradient-to-r from-admin-primary to-admin-secondary'
      } rounded-3xl py-2 sm:py-3 px-10 text-sm font-medium text-white shadow-sm hover:bg-admin-primary focus:outline-none focus:ring-2 focus:ring-admin-primary focus:ring-offset-2`}
    >
      {btnText}
    </Button>
  );
}
