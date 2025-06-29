import { getFilesByTagId } from "@/app/actions/file-action";
import { getTagInfo } from "@/app/actions/tag-action";
import BookCard from "@/components/book-card";
import supabase from "@/lib/supabase";

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;

    const [tagInfo, filesInfo] = await Promise.all([
      getTagInfo(slug),
      getFilesByTagId(slug),
    ]);

    return (
      <div className="flex flex-col gap-2">
        <div className="p-8 bg-gray-800 rounded shadow-md w-full">
          <h1 className="text-2xl font-bold text-white">{tagInfo.name}</h1>
          <p className="text-gray-400">Tag</p>
        </div>
        <div className="p-8 bg-gray-800 rounded shadow-md w-full ">
          <h2 className="text-xl font-bold mb-4 text-white">
            Files tagged with {tagInfo.name}
          </h2>
          <div className="grid md:grid-cols-6 grid-cols-3 gap-2">
            {filesInfo.length === 0 && (
              <div className="text-gray-400 col-span-full">
                No files found for this tag.
              </div>
            )}
            {filesInfo.map((file) => (
              <BookCard
                image={`https://mudocsstorage.blob.core.windows.net/${file.cover_path}`}
                title={file.title}
                slug={`/file/${file.id}`}
                key={file.id}
                author={
                  (file.file_authors || [])
                    .sort((a, b) => a.order - b.order)
                    .map((fa) => fa.authors?.name)
                    .filter(Boolean)
                    .join(", ") || "Unknown"
                }
              />
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching tag page data:", error);
    return <div className="text-red-500">Error fetching tag page data</div>;
  }
}

export async function generateStaticParams() {
  const res = await supabase.from("tags").select("id"); 
  const tags = res.data || [];

  return tags.map((tag: { id: string }) => ({
    slug: tag.id,
  }));
}
