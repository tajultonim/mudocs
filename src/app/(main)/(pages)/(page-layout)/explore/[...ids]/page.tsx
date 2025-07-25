import { getFilesByCategoryTypeByRange } from "@/app/actions/file-action";
import { collections, categorys } from "./generateStaticParams";
// import { notFound } from "next/navigation";

import { PageContent } from "./page-content";
import { Suspense } from "react";

export const dynamic = "force-static";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ids?: string[] }>;
}) {
  const [collectionId, categoryId] = (await params).ids || [];
  return {
    title: `${collectionName[collectionId as "bookmarks"] || ""} ${
      categoryName[categoryId as "book"] || ""
    } – μDocs `,
  };
}

export default async function Pages({
  params,
}: {
  params: Promise<{ ids?: string[] }> | { ids?: string[] };
}) {
  try {
    const [collectionId, categoryId] = (await params).ids || [];
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
      <Suspense>
        <PageContent
          initialQuery={fileQuery}
          categoryId={categoryId}
          collectionId={collectionId}
        />
      </Suspense>
    );
  } catch (error) {
    console.log(error);
    return <div className="text-red-500">Failed to load files</div>;
  }
}
