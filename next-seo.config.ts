import CONFIG from '@/config';

export default {
  openGraph: {
    url: CONFIG.url,
    type: 'website',
    locale: CONFIG.lang,
    images: CONFIG.seo.images
  },
  twitter: CONFIG.seo.twitter
};
