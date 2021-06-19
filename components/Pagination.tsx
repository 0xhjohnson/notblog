import Link from 'next/link';

interface PaginationProps {
  page: number;
  hasMore: boolean;
}

export default function Pagination({ page, hasMore }: PaginationProps) {
  return (
    <div className="flex justify-between">
      <Link href={page - 1 <= 0 ? '/' : `/page/${page - 1}`}>Previous</Link>
      <Link href={`/page/${page + 1}`}>Next</Link>
    </div>
  );
}
