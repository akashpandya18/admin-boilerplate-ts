'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface SecondaryButtonProps {
  btnText: string;
  btnType: 'submit' | 'button';
  single?: boolean;
}

export default function SecondaryButton({
  btnText,
  btnType,
  single = false,
}: SecondaryButtonProps) {
  const router = useRouter();
  return (
    <Button
      variant='outline'
      size='default'
      type={btnType}
      onClick={() => router.back()}
      className={`px-10 py-2 ${
        single ? 'mr-0' : 'mr-5'
      } text-sm font-medium border shadow-sm rounded-3xl border-admin-primary bg-gradient-to-r sm:py-3 focus:outline-none text-admin-primary`}
    >
      {btnText}
    </Button>
  );
}
