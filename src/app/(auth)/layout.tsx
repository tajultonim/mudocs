import Head from "next/head";

export const metadata = {
  title: "MuDocs | Authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <title>MuDocs | Authentication</title>
      </Head>
      <main>{children}</main>
    </>
  );
}
