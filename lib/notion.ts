import { Client } from '@notionhq/client';
import CONFIG from '@/config';

const notion = new Client({ auth: process.env.NOTION_KEY });

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

export async function getAllPosts() {
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
}
