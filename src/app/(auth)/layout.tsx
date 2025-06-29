import Head from "next/head";

export const metadata = {
  title: "MuDocs | Authentication",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>MuDocs | Authentication</title>
      </Head>
      <div className="flex min-h-svh items-center justify-center bg-gray-900 text-gray-100">
        {children}
      </div>
    </>
  );
}
