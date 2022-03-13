import { ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { useRouter } from 'next/router';

type Props = {
  children?: ReactNode;
  href: string;
};

export default function ActiveLink({ children, href }: Props) {
  const router = useRouter();

  return (
    <Link href={href}>
      <a
        className={clsx(
          'font-medium',
          router.pathname === href
            ? 'text-gray-900'
            : 'text-gray-500 hover:text-gray-900'
        )}
      >
        {children}
      </a>
    </Link>
  );
}
