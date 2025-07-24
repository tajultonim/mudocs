import { getFilesByCategoryTypeByRange } from "@/app/actions/file-action";
import { collections, categorys } from "./generateStaticParams";
import { notFound } from "next/navigation";

import { PageContent } from "./page-content";

export const dynamic = "error";

export default async function Pages({
  params,
}: {
  params: { ids?: string[] };
}) {
  //   try {
  const [collectionId, categoryId] = params.ids || [];
  if (
    (collectionId && !collections.includes(collectionId)) ||
    (categoryId && !categorys.includes(categoryId))
  ) {
    console.log("Invalid collection or category ID");
    return notFound();
  }
  const fileQuery = await getFilesByCategoryTypeByRange({
    category: collectionId,
    type: categoryId,
  });
  return (
    <PageContent
      initialQuery={fileQuery}
      categoryId={categoryId}
      collectionId={collectionId}
    />
  );
  //   } catch (error) {
  //     console.error("Error fetching files:", error);
  //     return <div className="text-red-500">Failed to load files</div>;
  //   }
}
