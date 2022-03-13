import Link from 'next/link';
import { getPageProperty } from '@/lib/notion';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

interface PostPreviewProps {
  post: QueryDatabaseResponse['results'][number];
}

export default function PostPreview({ post }: PostPreviewProps) {
  return (
    <li className="py-12">
      <article className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
        <dl>
          <dt className="sr-only">Published on</dt>
          <dd className="text-base leading-6 font-medium text-gray-500">
            <time dateTime={getPageProperty('date', post) ?? ''}>
              {getPageProperty('date', post)}
            </time>
          </dd>
        </dl>
        <div className="space-y-5 xl:col-span-3">
          <div className="space-y-6">
            <h2 className="text-2xl leading-8 font-bold tracking-tight">
              <Link href={`/${getPageProperty('slug', post)}`}>
                <a className="text-gray-900">
                  {getPageProperty('title', post)}
                </a>
              </Link>
            </h2>
            <div className="prose max-w-none text-gray-500">
              {getPageProperty('summary', post)}
            </div>
          </div>
          <div className="text-base leading-6 font-medium">
            <Link href={`/${getPageProperty('slug', post)}`}>
              <a
                className="text-pink-500 hover:text-pink-600"
                aria-label={`Read "${getPageProperty('title', post)}"`}
              >
                Read more &rarr;
              </a>
            </Link>
          </div>
        </div>
      </article>
    </li>
  );
}
