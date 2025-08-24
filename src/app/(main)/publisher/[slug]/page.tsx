import { getPublisherBySlug } from "@/app/actions/publisher-action";
import { getFilesByPublisherId } from "@/app/actions/file-action";

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

export const dynamicParams = false;

export type PublisherWithFilesDetails = {
  id: string;
  name: string;
  slug: string;
  created_at: string; // ISO date string
  // add other publisher fields here if needed, e.g.:
  // bio?: string;
  // email?: string;

  files: {
    id: string;
    title: string;
    cover_path: string;
    authors: {
      id: string;
      name: string;
      slug: string;
      order: string;
    }[];
  }[];
};

export default async function PublisherPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {

    const publisher = await getPublisherBySlug(slug);
    const fileQuery = await getFilesByPublisherId(publisher.id);

    return (
      <>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Authors</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{publisher.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <CardGrid
          numberOfPages={Math.ceil(fileQuery.count / 17)}
          pageNumber={1}
          query={fileQuery}
          title={`From ${publisher.name}`}
        />
      </>
    );
  } catch (error) {
    console.error("Error fetching author page data:", error);
    return <div className="text-red-500">Error fetching author page data</div>;
  }
}

export async function generateStaticParams() {
  const res = await supabase.from("publishers").select("slug");
  const publishers = res.data || [];
  return publishers.map((publisher: { slug: string }) => ({
    slug: publisher.slug,
  }));
}
