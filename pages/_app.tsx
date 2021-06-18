import 'tailwindcss/tailwind.css';
import { DefaultSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import SEO from '@/next-seo.config';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
