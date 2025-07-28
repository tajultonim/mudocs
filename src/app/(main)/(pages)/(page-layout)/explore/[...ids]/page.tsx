import { getFilesByCategoryTypeByRange } from "@/app/actions/file-action";
import { exploreData } from "@/app/sidebar-data";
// import { notFound } from "next/navigation";

import { PageContent } from "./page-content";
import { Suspense } from "react";
import { Metadata } from "next";

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
}): Promise<Metadata> {
  const { ids } = await params;
  const [collectionId, categoryId] = ids || [];
  return {
    title: `${collectionName[collectionId as "bookmarks"] || ""} ${
      categoryName[categoryId as "book"] || ""
    } | μDocs`,
    openGraph: {
      title: `${collectionName[collectionId as "bookmarks"] || ""} ${
        categoryName[categoryId as "book"] || ""
      } | μDocs`,
      url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/explore/${collectionId}/${categoryId}`,
      description:
        "An e-library for academic papers and books, including resources from the Seminar Library of the Department of Physics, University of Rajshahi.",
      siteName: "μDocs",
      images: [
        {
          url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/og-1200x630.png`,
          width: 1200,
          height: 630,
          alt: "μDocs – Explore Science Books & Papers",
        },
        {
          url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/og-2500x1313.png`,
          width: 2500,
          height: 1313,
          alt: "μDocs – Explore Science Books & Papers",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${collectionName[collectionId as "bookmarks"] || ""} ${
        categoryName[categoryId as "book"] || ""
      } | μDocs`,
      description:
        "Discover physics books and seminar papers from Rajshahi University’s Department of Physics.",
      images: [
        `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/og-1200x630.png`,
        `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/og-2500x1313.png`,
      ],
      creator: "@tajultonim",
    },
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
