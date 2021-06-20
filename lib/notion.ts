import dayjs from 'dayjs';
import { Client, APIResponseError, APIErrorCode } from '@notionhq/client';
import { Page, PropertyValue } from '@notionhq/client/build/src/api-types';
import { PostPreview } from '@/types';
import CONFIG from '@/config';

const notion = new Client({ auth: process.env.NOTION_KEY });

function extractValueToString(property: PropertyValue): string | null {
  switch (property.type) {
    case 'date':
      return dayjs(property.date.start).format(CONFIG.dateFormat);
    case 'rich_text':
      return property.rich_text.map((t) => t.plain_text).join('');
    case 'title':
      return property.title.map((t) => t.plain_text).join('');
    case 'select':
      return property.select.name;
    case 'multi_select':
      return property.multi_select.map((select) => select.name).join(', ');
    default:
      return '';
  }
}

function normalizeResults(results: Page[]) {
  return results.map((post) =>
    Object.fromEntries([
      ...Object.entries(post.properties).map(([key, value]) => [
        key,
        extractValueToString(value)
      ]),
      ['id', post.id]
    ])
  );
}

async function getPostPreview(startCursor?: string) {
  if (!process.env.NOTION_DATABASE_ID) {
    console.error('Notion database ID must be provided in .env file');
    return null;
  }

  let postPreview;

  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'title',
            text: {
              is_not_empty: true
            }
          },
          {
            property: 'slug',
            text: {
              is_not_empty: true
            }
          },
          {
            property: 'status',
            select: {
              equals: 'Published'
            }
          },
          {
            property: 'type',
            select: {
              equals: 'Post'
            }
          }
        ]
      },
      sorts: [
        {
          property: 'date',
          direction: 'descending'
        }
      ],
      start_cursor: startCursor,
      page_size: CONFIG.postsPerPage
    });

    const results: PostPreview[] = normalizeResults(res.results);

    postPreview = {
      hasMore: res.has_more,
      nextCursor: res.next_cursor,
      results
    };
  } catch (error: unknown) {
    if (APIResponseError.isAPIResponseError(error)) {
      switch (error.code) {
        case APIErrorCode.Unauthorized:
          console.error(
            `Unable to authorize access to Notion using supplied NOTION_KEY
            Double check your .env file`
          );
          break;
        default:
          console.error('Something went wrong, unhandled error');
      }
    }
  }

  return postPreview;
}

export async function getAllPostPreviews() {
  const allPostPreviews = [];

  // fetch the first page of post previews
  const postPreview = await getPostPreview();
  // early exit if there are no posts
  if (!postPreview) {
    return [];
  }

  allPostPreviews.push(postPreview);

  let hasMore = postPreview.hasMore;
  let nextCursor = postPreview.nextCursor || undefined;

  // continue fetching if there are more pages
  while (hasMore) {
    const nextPostPreview = await getPostPreview(nextCursor);
    if (!nextPostPreview) {
      break;
    }

    nextCursor = nextPostPreview.nextCursor || undefined;
    allPostPreviews.push(nextPostPreview);

    if (!nextPostPreview.hasMore) {
      hasMore = false;
    }
  }

  return allPostPreviews;
}
