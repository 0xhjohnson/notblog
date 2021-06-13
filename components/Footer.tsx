import Link from 'next/link';
import CONFIG from '@/config';

export default function Footer() {
  return (
    <footer className="flex justify-between items-center py-10 border-t">
      <p className="text-gray-500">&copy; 2021 {CONFIG.author}</p>
    </footer>
  );
}
