import BookCard from "@/components/book-card";
import TopBar from "@/components/topbar";
import { SearchParams } from "next/dist/server/request/search-params";
import { getFilesByRange } from "../actions/file-action";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  try {
    const params = await searchParams;
    const fileQuery = await getFilesByRange();
    return (
      <>
        <TopBar activeTag={(params.tab as string) || ""} />
        <div className=" grid lg:grid-cols-6 grid-cols-3 gap-4">
          {fileQuery
            ?.filter((book) => (params.tab ? book.type == params.tab : true))
            .map((book) => (
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
  } catch (error) {
    console.error("Error fetching files:", error);
    return <div className="text-red-500">Failed to load files</div>;
  }
}
