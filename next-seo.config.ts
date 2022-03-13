import CONFIG from '@/config';

const SEO = {
  openGraph: {
    url: CONFIG.url,
    type: 'website',
    locale: CONFIG.lang,
    images: CONFIG.seo.images
  },
  twitter: CONFIG.seo.twitter,
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico'
    }
  ]
};

export default SEO;
