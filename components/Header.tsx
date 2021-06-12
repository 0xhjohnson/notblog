import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex justify-between items-center py-10">
      <Link href="/">
        <a aria-label="Hunter Johnson blog">0xhjohnson</a>
      </Link>
      <p>NavBar items</p>
    </header>
  );
}
