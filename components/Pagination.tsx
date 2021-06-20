import Link from 'next/link';
import clsx from 'clsx';
import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon
} from '@heroicons/react/solid';

interface PaginationProps {
  page: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageCount: number;
}

export default function Pagination({
  page,
  canPreviousPage,
  canNextPage,
  pageCount
}: PaginationProps) {
  return (
    <nav className="flex items-center justify-betwen" aria-label="Pagination">
      <div className="-mt-px w-0 flex-1 flex">
        {canPreviousPage ? (
          <Link href={page - 1 <= 1 ? '/' : `/page/${page - 1}`}>
            <a className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              <ArrowNarrowLeftIcon
                className="mr-3 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              Previous
            </a>
          </Link>
        ) : (
          <p className="text-gray-300 border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium">
            <ArrowNarrowLeftIcon
              className="mr-3 h-5 w-5 text-gray-300"
              aria-hidden="true"
            />
            Previous
          </p>
        )}
      </div>
      <div className="hidden md:-mt-px md:flex">
        {[...Array(pageCount)].map((_, idx) => {
          const pageNumber = idx + 1;

          if (pageCount < 7) {
            return (
              <Link
                href={pageNumber === 1 ? '/' : `/page/${pageNumber}`}
                key={pageNumber}
              >
                <a
                  className={clsx(
                    page === pageNumber
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium'
                  )}
                >
                  {pageNumber}
                </a>
              </Link>
            );
          } else {
            if (idx === 3) {
              return (
                <span
                  key={pageNumber}
                  className="border-transparent text-gray-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
                >
                  ...
                </span>
              );
            } else if (idx < 3 || idx >= pageCount - 3) {
              return (
                <Link
                  href={pageNumber === 1 ? '/' : `/page/${pageNumber}`}
                  key={pageNumber}
                >
                  <a
                    className={clsx(
                      page === pageNumber
                        ? 'border-pink-500 text-pink-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      'border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium'
                    )}
                  >
                    {pageNumber}
                  </a>
                </Link>
              );
            }
          }

          return null;
        })}
      </div>
      <div className="-mt-px w-0 flex-1 flex justify-end">
        {canNextPage ? (
          <Link href={`/page/${page + 1}`}>
            <a className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Next
              <ArrowNarrowRightIcon
                className="ml-3 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </a>
          </Link>
        ) : (
          <p className="text-gray-300 border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium">
            Next
            <ArrowNarrowRightIcon
              className="ml-3 h-5 w-5 text-gray-300"
              aria-hidden="true"
            />
          </p>
        )}
      </div>
    </nav>
  );
}
