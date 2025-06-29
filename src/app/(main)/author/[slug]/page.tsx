import { getAuthorById } from "@/app/actions/author-action";
import { getFilesByAuthorId } from "@/app/actions/file-action";
import BookCard from "@/components/book-card";
import supabase from "@/lib/supabase";

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
    const [author, files] = await Promise.all([
      getAuthorById(slug),
      getFilesByAuthorId(slug),
    ]);

    return (
      <div className="flex flex-col gap-2">
        <div className="p-8 bg-gray-800 rounded shadow-md w-full">
          <h1 className="text-2xl font-bold text-white">{author.name}</h1>
          <p className=" text-gray-400">Author</p>
        </div>
        <div className="p-8 bg-gray-800 rounded shadow-md w-full ">
          <h2 className="text-xl font-bold mb-4 text-white">
            Books by {author.name}
          </h2>
          <div className="grid md:grid-cols-6 grid-cols-3 gap-2">
            {files.length === 0 && (
              <div className="text-gray-400 col-span-full">
                No books found for this author.
              </div>
            )}
            {files.map((file) => (
              <BookCard
                image={`https://mudocsstorage.blob.core.windows.net/${file.cover_path}`}
                title={file.title}
                slug={`/file/${file.id}`}
                key={file.id}
                author={
                  (file.file_authors || [])
                    .sort((a, b) => a.order - b.order)
                    .map((fa) => fa.authors.name)
                    .join(", ") || "Unknown"
                }
              />
            ))}
          </div>
        </div>
      </div>
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
