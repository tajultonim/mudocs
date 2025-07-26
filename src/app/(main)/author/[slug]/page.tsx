import { getAuthorById } from "@/app/actions/author-action";
import { getFilesByAuthorId } from "@/app/actions/file-action";
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

export type AuthorWithFilesDetails = {
  id: string;
  name: string;
  slug: string;
  created_at: string; // ISO date string
  // add other author fields here if needed, e.g.:
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

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const [author, fileQuery] = await Promise.all([
      getAuthorById(slug),
      getFilesByAuthorId(slug),
    ]);

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
              <BreadcrumbPage>{author.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <CardGrid
          numberOfPages={Math.ceil(fileQuery.count / 17)}
          pageNumber={1}
          query={fileQuery}
          title={`From ${author.name}`}
        />
      </>
    );
  } catch (error) {
    console.error("Error fetching author page data:", error);
    return <div className="text-red-500">Error fetching author page data</div>;
  }
}

export async function generateStaticParams() {
  const res = await supabase.from("authors").select("id");
  const authors = res.data || [];

  return authors.map((author: { id: string }) => ({
    slug: author.id,
  }));
}
