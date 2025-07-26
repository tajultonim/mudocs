import { getFilesByCategoryTypeByRange } from "@/app/actions/file-action";
import { exploreData } from "@/app/sidebar-data";
// import { notFound } from "next/navigation";

import { PageContent } from "./page-content";
import { Suspense } from "react";
import Head from "next/head";

export const dynamic = "force-static";

const pathIDArray = [
  ...new Set(
    exploreData
      .map((item) => {
        return [...item.items.map((subitem) => subitem.slug)];
      })
      .flat()
      .map((s) => s.replace("/explore/", "").split("/"))
  ),
].map((items) => {
  return {
    ids: items,
  };
});

const collectionName = {
  bookmarks: "Bookmarks",
  "s-lib": "Seminar Library",
  "e-lib": "E Library",
  collection: "All",
};

const categoryName = {
  book: "Books",
  paper: "Papers",
  note: "Notes",
  other: "Documents",
};

const collections = [
  ...new Set(
    pathIDArray
      .filter((item) => item.ids[0])
      .map((item) => {
        return item.ids[0];
      })
  ),
];

const categorys = [
  ...new Set(
    pathIDArray
      .filter((item) => item.ids[1])
      .map((item) => {
        return item.ids[1];
      })
  ),
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ids?: string[] }>;
}) {
  const { ids } = await params;
  const [collectionId, categoryId] = ids || [];
  return {
    title: `${collectionName[collectionId as "bookmarks"] || ""} ${
      categoryName[categoryId as "book"] || ""
    }`,
  };
}

export default async function Pages({
  params,
}: {
  params: Promise<{ ids?: string[] }>;
}) {
  try {
    const { ids } = await params;
    const [collectionId, categoryId] = ids || [];
    if (
      (collectionId && !collections.includes(collectionId)) ||
      (categoryId && !categorys.includes(categoryId))
    ) {
      return <p>Not Valid Path!</p>;
    }
    const fileQuery = await getFilesByCategoryTypeByRange({
      category: collectionId,
      type: categoryId,
    });
    return (
      <>
        {!collectionId && (
          <Head>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Home",
                      item: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/`,
                    },
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: collectionName[collectionId as "bookmarks"] || "",
                      item: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/explore/${collectionId}`,
                    },
                    ...(categoryId
                      ? [
                          {
                            "@type": "ListItem",
                            position: 3,
                            name: categoryName[categoryId as "book"] || "",
                            item: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/explore/${collectionId}/${categoryId}`,
                          },
                        ]
                      : []),
                  ],
                }).replace(/</g, "\\u003c"),
              }}
            />
          </Head>
        )}
        <Suspense>
          <PageContent
            initialQuery={fileQuery}
            categoryId={categoryId}
            collectionId={collectionId}
          />
        </Suspense>
      </>
    );
  } catch (error) {
    console.log(error);
    return <div className="text-red-500">Failed to load files</div>;
  }
}

export async function generateStaticParams() {
  try {
    return pathIDArray;
  } catch (error) {
    console.log(error);
    return [{ ids: [] }];
  }
}
