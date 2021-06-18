import dayjs from 'dayjs';
import { Client, APIResponseError, APIErrorCode } from '@notionhq/client';
import { PropertyValue } from '@notionhq/client/build/src/api-types';
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

export async function getAllPages() {
  if (!process.env.NOTION_DATABASE_ID) {
    console.error('Notion database ID must be provided in .env file');
    return null;
  }

  return notion.databases.query({
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
            equals: 'Page'
          }
        }
      ]
    },
    sorts: [
      {
        property: 'date',
        direction: 'descending'
      }
    ]
  });
}

export async function getAllPostPreviews() {
  if (!process.env.NOTION_DATABASE_ID) {
    console.error('Notion database ID must be provided in .env file');
    return null;
  }

  try {
    const postsRes = await notion.databases.query({
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
      page_size: CONFIG.postsPerPage
    });

    return postsRes.results.map((post) =>
      Object.fromEntries([
        ...Object.entries(post.properties).map(([key, value]) => [
          key,
          extractValueToString(value)
        ]),
        ['id', post.id]
      ])
    );
  } catch (error: unknown) {
    if (APIResponseError.isAPIResponseError(error)) {
      switch (error.code) {
        case APIErrorCode.Unauthorized:
          console.error(
            'Unable to authorize access to Notion using supplied NOTION_KEY'
          );
          console.error('Double check your .env file');
          break;
        default:
          console.error('Something went wrong, unhandled error');
      }
    }
  }
}
