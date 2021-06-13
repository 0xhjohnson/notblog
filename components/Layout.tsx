import type { ReactNode } from 'react';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Container>
        <Header />
      </Container>
      <Container>
        <main>{children}</main>
      </Container>
      <Container>
        <Footer />
      </Container>
    </>
  );
}
