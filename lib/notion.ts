import { APIErrorCode, Client, isNotionClientError } from '@notionhq/client';
import CONFIG from '@/config';
import {
  isFullPage,
  richTextAsPlainText,
  getProperty
} from '@jitl/notion-api/src/lib/notion-api';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({ auth: process.env.NOTION_KEY });

export function getPageProperty(
  propertyName: string,
  page: QueryDatabaseResponse['results'][number]
) {
  if (isFullPage(page)) {
    const property = getProperty(page, { name: propertyName });
    if (!property) {
      return null;
    }

    switch (property.type) {
      case 'rich_text':
        return richTextAsPlainText(property.rich_text);
      case 'title':
        return richTextAsPlainText(property.title);
      case 'date':
        return property?.date?.start;
      default:
        console.error(`unhandled property of type: ${property.type}`);
    }
  }
}

async function getPosts(startCursor?: string) {
  if (!process.env.NOTION_DATABASE_ID) {
    console.error('Notion database ID must be provided in .env file');
    return null;
  }

  let response;

  try {
    response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'title',
            title: {
              is_not_empty: true
            }
          },
          {
            property: 'slug',
            rich_text: {
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

    response.results.filter((post) => isFullPage(post));
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      switch (error.code) {
        case APIErrorCode.Unauthorized:
          console.error(
            `Unable to authorize access to Notion using supplied NOTION_KEY:
            Double check your .env.local file or create if you haven't already`
          );
          break;
        default:
          console.error('Something went wrong, unhandled error');
      }
    }
  }

  return response;
}

export async function getAllPosts() {
  const allPosts = [];

  const latestPosts = await getPosts();
  if (!latestPosts) {
    return [];
  }

  allPosts.push(latestPosts);

  let hasMore = latestPosts.has_more;
  let nextCursor = latestPosts.next_cursor ?? undefined;

  while (hasMore) {
    const morePosts = await getPosts(nextCursor);
    if (!morePosts) {
      break;
    }

    allPosts.push(morePosts);

    nextCursor = morePosts.next_cursor ?? undefined;
    if (!morePosts.has_more) {
      hasMore = false;
    }
  }

  return allPosts;
}
