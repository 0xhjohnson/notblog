import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex justify-between items-center py-10">
      <Link href="/">
        <a aria-label="Blog">
          <img src="/logo.svg" alt="Logo" className="h-6 sm:hidden" />
          <img
            src="/wide-logo.svg"
            alt="Full width logo"
            className="hidden sm:block h-6"
          />
        </a>
      </Link>
      <p>NavBar items</p>
    </header>
  );
}
