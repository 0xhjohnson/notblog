const CONFIG = {
  title: 'notblog',
  description:
    'Notion powered blog built using Next.js and TailwindCSS. Fast, responsive, and easy to customize.',
  author: 'Hunter Johnson',
  email: '0xhjohnson@pm.me',
  url: 'https://notblog.vercel.app',
  lang: 'en-US',
  seo: {
    twitter: {
      cardType: 'summary_large_image',
      site: '@notblog', // @username for the website
      handle: '@0xhjohnson' // @username for the author
    },
    images: []
  },
  postsPerPage: 10,
  // pass a valid date format
  // https://day.js.org/docs/en/display/format
  dateFormat: 'MMMM D, YYYY'
};

export default CONFIG;
