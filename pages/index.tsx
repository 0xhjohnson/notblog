import { NextSeo } from 'next-seo';
import { GetStaticProps } from 'next';
import { getAllPosts } from '@/lib/notion';
import CONFIG from '@/config';
import Layout from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import PostPreview from '@/components/PostPreview';

interface BlogProps {
  latestPosts: QueryDatabaseResponse;
  pageCount: number;
}

export default function Blog({ latestPosts, pageCount }: BlogProps) {
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
          {latestPosts?.results.map((post) => (
            <PostPreview key={post.id} post={post} />
          ))}
        </ul>
        <div className="pb-4">
          <Pagination
            page={1}
            canPreviousPage={false}
            canNextPage={latestPosts.has_more}
            pageCount={pageCount}
          />
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPosts();
  const latestPosts = posts.at(0);

  return {
    props: {
      latestPosts,
      pageCount: posts.length
    },
    revalidate: 10
  };
};
