import Link from 'next/link';
import dayjs from 'dayjs';
import { NextSeo } from 'next-seo';
import { GetStaticProps, GetStaticPaths } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getAllPostPreviews } from '@/lib/notion';
import { PostPreviewResponse } from '@/types';
import CONFIG from '@/config';
import Layout from '@/components/Layout';
import Pagination from '@/components/Pagination';

interface PageProps {
  postPreviews: PostPreviewResponse[];
  page: number;
}

export default function Page({ postPreviews, page }: PageProps) {
  const pagePostPreviews = postPreviews[page];

  return (
    <Layout>
      <NextSeo title={CONFIG.title} description={CONFIG.description} />
      <div className="divide-y divide-gray-200">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold text-gray-900 tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Latest
          </h1>
          <p className="text-lg leading-7 text-gray-500">
            The latest posts, straight from the source.
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {pagePostPreviews?.results.map((post) => (
            <li key={post.id} className="py-12">
              <article className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                <dl>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base leading-6 font-medium text-gray-500">
                    <time
                      dateTime={dayjs(post.date, CONFIG.dateFormat).format(
                        'YYYY-MM-DD'
                      )}
                    >
                      {post.date}
                    </time>
                  </dd>
                </dl>
                <div className="space-y-5 xl:col-span-3">
                  <div className="space-y-6">
                    <h2 className="text-2xl leading-8 font-bold tracking-tight">
                      <Link href={`/${post.slug}`}>
                        <a className="text-gray-900">{post.title}</a>
                      </Link>
                    </h2>
                    <div className="prose max-w-none text-gray-500">
                      {post.summary}
                    </div>
                  </div>
                  <div className="text-base leading-6 font-medium">
                    <Link href={`/${post.slug}`}>
                      <a
                        className="text-pink-500 hover:text-pink-600"
                        aria-label={`Read "${post.title}"`}
                      >
                        Read more &rarr;
                      </a>
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <Pagination page={page} hasMore={pagePostPreviews.hasMore} />
      </div>
    </Layout>
  );
}

interface Params extends ParsedUrlQuery {
  page: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { page } = context.params as Params;
  const postPreviews = await getAllPostPreviews();

  return {
    props: {
      postPreviews,
      page: Number(page)
    },
    revalidate: 10
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const postPreviews = await getAllPostPreviews();
  const pageCount = postPreviews ? postPreviews.length : 1;

  return {
    paths: [...Array(pageCount - 1)].map((page, idx) => ({
      params: {
        page: String(idx + 2)
      }
    })),
    fallback: true
  };
};
