import { getFilesByCategoryTypeByRange } from "@/app/actions/file-action";
import { collections, categorys } from "./generateStaticParams";
// import { notFound } from "next/navigation";

import { PageContent } from "./page-content";
import { Suspense } from "react";

export const dynamic = "error";

export default async function Pages({
  params,
}: {
  params: { ids?: string[] };
}) {
  try {
    const [collectionId, categoryId] = params.ids || [];
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
