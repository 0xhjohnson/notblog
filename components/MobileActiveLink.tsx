import { ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { useRouter } from 'next/router';

type Props = {
  href: string;
  title: string;
  handleClick: () => void;
  icon?: ReactNode;
};

function MobileActiveLink({ href, title, handleClick, icon }: Props) {
  const router = useRouter();

  return (
    <Link href={href}>
      <a
        className={clsx(
          '-m-3 p-3 flex items-center rounded-md hover:bg-gray-50 hover:text-gray-900',
          router.pathname === href ? 'text-gray-900' : 'text-gray-500'
        )}
        onClick={handleClick}
      >
        {icon}
        <span className="ml-3 font-medium">{title}</span>
      </a>
    </Link>
  );
}

export default MobileActiveLink;
