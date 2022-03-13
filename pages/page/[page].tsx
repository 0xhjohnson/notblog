import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { GetStaticProps, GetStaticPaths } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getAllPosts } from '@/lib/notion';
import CONFIG from '@/config';
import Layout from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import PostPreview from '@/components/PostPreview';

interface PageProps {
  posts: QueryDatabaseResponse;
  page: number;
  pageCount: number;
}

export default function Page({ posts, page, pageCount }: PageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <NextSeo
        title={`${CONFIG.title} — page ${page}`}
        description={CONFIG.description}
      />
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
            <PostPreview key={post.id} post={post} />
          ))}
        </ul>
        <div className="pb-4">
          <Pagination
            page={page}
            canPreviousPage={true}
            canNextPage={posts.has_more}
            pageCount={pageCount}
          />
        </div>
      </div>
    </Layout>
  );
}

interface Params extends ParsedUrlQuery {
  page: string;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { page } = params as Params;
  const posts = await getAllPosts();

  return {
    props: {
      posts: posts[Number(page) - 1],
      page: Number(page),
      pageCount: posts.length
    },
    revalidate: 10
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();
  const pageCount = posts ? posts.length : 1;

  return {
    paths: Array.from({ length: pageCount }, (_, i) => ({
      params: {
        page: String(i + 1)
      }
    })),
    fallback: true
  };
};
