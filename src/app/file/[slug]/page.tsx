import supabase from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

export default async function FilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fileData = await supabase
    .from("files")
    .select(
      `*,
      file_authors!file_authors_file_id_fkey(
        authors!file_authors_author_id_fkey(name)
      ),
      file_tags!file_tags_file_id_fkey(
        tags!file_tags_tag_id_fkey(name)
      )
    `
    )
    .eq("id", slug)
    .single();

  return (
    <div className="">
      <Image
        src={`https://mudocsstorage.blob.core.windows.net/${fileData.data?.cover_path}`}
        alt={fileData.data?.title || "Book Cover"}
        width={300}
        height={400}
      />
      <h1 className="text-2xl font-bold">{fileData.data?.title}</h1>
      <p className="text-gray-600">{fileData.data?.description}</p>
      <p className="text-gray-600">
        Tags:{" "}
        {fileData.data?.file_tags
          .map((tag) => tag.tags?.name ?? "")
          .join(", ")}
      </p>
      <p className="text-gray-600">
        Authors:{" "}
        {fileData.data?.file_authors
          .map(
            (author: { authors: { name: string } }) => author.authors.name ?? ""
          )
          .join(", ")}
      </p>
      <p className="text-gray-600">Type: {fileData.data?.type}</p>
      <p className="text-gray-600">
        Size: {((fileData.data?.size_bytes ?? 0) / (1024 * 1024)).toFixed(2)} MB
      </p>
      <Link
        href={`https://mudocsstorage.blob.core.windows.net/${fileData.data?.file_path}`}
        className="text-blue-500 hover:underline"
      >
        Download File
      </Link>
    </div>
  );
}

export async function generateStaticParams() {
  const res = await supabase.from("files").select("id"); // returns list of books
  const books = res.data || [];

  return books.map((book: { id: string }) => ({
    slug: book.id,
  }));
}
