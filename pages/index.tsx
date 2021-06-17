import Link from 'next/link';
import dayjs from 'dayjs';
import { NextSeo } from 'next-seo';
import { InferGetStaticPropsType } from 'next';
import { getAllPosts } from '@/lib/notion';
import CONFIG from '@/config';
import Layout from '@/components/Layout';

export const getStaticProps = async () => {
  const posts = await getAllPosts();

  return {
    props: {
      posts
    },
    revalidate: 10
  };
};

export default function Blog({
  posts
}: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log(posts);
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
          {posts?.results.map((post) => (
            <li key={post.id} className="py-12">
              <article className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                <dl>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base leading-6 font-medium text-gray-500">
                    <time dateTime={post?.properties?.date?.date?.start}>
                      {dayjs(post?.properties?.date?.date?.start).format(
                        CONFIG.dateFormat
                      )}
                    </time>
                  </dd>
                </dl>
                <div className="space-y-5 xl:col-span-3">
                  <div className="space-y-6">
                    <h2 className="text-2xl leading-8 font-bold tracking-tight">
                      <Link
                        href={post?.properties?.slug?.rich_text[0]?.plain_text}
                      >
                        <a className="text-gray-900">
                          {post?.properties?.title?.title[0]?.plain_text}
                        </a>
                      </Link>
                    </h2>
                    <div className="prose max-w-none text-gray-500">
                      {/* enhance with ability to parse annotations */}
                      {post?.properties?.summary?.rich_text[0]?.plain_text}
                    </div>
                  </div>
                  <div className="text-base leading-6 font-medium">
                    <Link
                      href={post?.properties?.slug?.rich_text[0]?.plain_text}
                    >
                      <a
                        className="text-pink-500 hover:text-pink-600"
                        aria-label={`Read "${post?.properties?.title?.title[0]?.plain_text}"`}
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
      </div>
    </Layout>
  );
}
