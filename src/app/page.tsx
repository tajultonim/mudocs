import BookCard from "@/components/book-card";
import TopBar from "@/components/topbar";
import supabase from "@/lib/supabase";

export default async function Home() {
  const fileQuery = await supabase
    .from("files")
    .select(
      `
    id,
    title,
    cover_path,
    file_authors!file_authors_file_id_fkey(
      authors!file_authors_author_id_fkey(name),
      order
    )
  `
    ).order("title", { ascending: true })
    .limit(12);
  return (
    <>
      <TopBar />
      <div className=" grid lg:grid-cols-6 sm:grid-cols-3 grid-cols-2 gap-4">
        {fileQuery.data?.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            author={book.file_authors
              .sort((a, b) => a.order - b.order)
              .map((a: { authors: { name: string } }) => a.authors.name)
              .join(", ")}
            image={`https://mudocsstorage.blob.core.windows.net/${book.cover_path}`}
            slug={"/file/" + book.id}
          />
        ))}
      </div>
    </>
  );
}
