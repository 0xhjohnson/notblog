import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import ActiveLink from '@/components/ActiveLink';
import MobileActiveLink from '@/components/MobileActiveLink';

interface NavItem {
  label: string;
  href: string;
  isExternal: boolean;
}

const navItems: NavItem[] = [
  { label: 'Blog', href: '/', isExternal: false },
  {
    label: 'Source',
    href: 'https://github.com/0xhjohnson/notblog',
    isExternal: true
  }
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header>
      <div className="flex justify-between items-center py-10">
        <Link href="/">
          <a aria-label="Blog" className="w-8 sm:w-32 h-6 relative">
            <div className="sm:hidden">
              <Image src="/logo.svg" alt="Logo" layout="fill" />
            </div>
            <div className="hidden sm:block">
              <Image src="/wide-logo.svg" alt="Full width logo" layout="fill" />
            </div>
          </a>
        </Link>
        <div className="w-full"></div>
        <div className="-mr-2 -my-2 sm:hidden">
          <button
            className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Open menu</span>
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="hidden sm:flex space-x-6">
          {navItems.map((item) => (
            <div key={item.href}>
              {item.isExternal ? (
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={item.href}
                  key={item.href}
                  className="font-medium text-gray-500 hover:text-gray-900"
                >
                  {item.label}
                </a>
              ) : (
                <ActiveLink href={item.href} key={item.href}>
                  {item.label}
                </ActiveLink>
              )}
            </div>
          ))}
        </nav>
      </div>
      <Transition
        show={isOpen}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
        className="absolute z-50 top-0 inset-x-0 py-3 p-2 transtion transform origin-top-right md:hidden"
      >
        <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
          <div className="pt-5 pb-6 px-5">
            <div className="flex items-center justify-between">
              <div className="w-8 h-6 relative">
                <Image src="/logo.svg" alt="Logo" layout="fill" />
              </div>
              <div className="-mr-2">
                <button
                  className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
                  onClick={toggleMobileMenu}
                >
                  <span className="sr-only">Close menu</span>
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="mt-6">
              <nav className="grid gap-y-6">
                {navItems.map((item) => (
                  <MobileActiveLink
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    handleClick={toggleMobileMenu}
                  />
                ))}
              </nav>
            </div>
          </div>
        </div>
      </Transition>
    </header>
  );
}
