import { getFilesByTagId } from "@/app/actions/file-action";
import { getTagInfoBySlug } from "@/app/actions/tag-action";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import supabase from "@/lib/supabase";
import { CardGrid } from "../../(pages)/(page-layout)/explore/[...ids]/page-content";

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;

    const tagInfo = await getTagInfoBySlug(slug);
    const filesInfo = await getFilesByTagId(tagInfo.id);

    return (
      <>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tags</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{tagInfo.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <CardGrid
          numberOfPages={Math.ceil(filesInfo.count / 17)}
          pageNumber={1}
          query={filesInfo}
          title={`Tagged with ${tagInfo.name}`}
        />
      </>
    );
  } catch (error) {
    console.error("Error fetching tag page data:", error);
    return <div className="text-red-500">Error fetching tag page data</div>;
  }
}

export async function generateStaticParams() {
  const res = await supabase.from("tags").select("slug");
  const tags = res.data || [];
  return tags.map((tag: { slug: string }) => ({
    slug: tag.slug,
  }));
}
