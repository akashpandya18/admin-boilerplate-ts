import Layout from '@/components/Layout/Layout';

export const metadata = {
  title: 'Admin Panel',
  description: 'Generated by create next app',
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Layout>{children}</Layout>
    </main>
  );
}