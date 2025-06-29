import DownloadButton from "@/components/download-button";
import InfoBar from "@/components/info-bar";
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
      authors:file_authors!file_authors_file_id_fkey(
        file_author:authors!file_authors_author_id_fkey(name,id,slug),
        order
      ),
      tags:file_tags!file_tags_file_id_fkey(
        file_tag:tags!file_tags_tag_id_fkey(name,id,slug)
      ),
      uploader:users(id, username)
    `
    )
    .eq("id", slug)
    .single();

  return (
    <div className="flex flex-col gap-2">
      <div className="p-8 bg-gray-800 rounded shadow-md w-full flex flex-col md:flex-row gap-8 items-center">
        <Image
          src={`https://mudocsstorage.blob.core.windows.net/${fileData.data?.cover_path}`}
          alt={fileData.data?.title || "Book Cover"}
          width={200}
          height={280}
          quality={1}
          className="rounded shadow-md"
        />
        <div className="flex-1 w-full">
          <h1 className="text-2xl font-bold mb-4 text-white">
            {fileData.data?.title}
          </h1>
          <InfoBar
            label="Description"
            value={fileData.data?.description || "-"}
          />
          <InfoBar
            label="Tags"
            // value={
            //   fileData.data?.file_tags
            //     .map((tag) => tag.tags?.name ?? "")
            //     .join(", ") || "-"
            // }
            value={
              fileData.data?.tags
                .map((tag, index) => (
                  <span key={tag.file_tag.id}>
                    <Link
                      href={"/tag/" + tag.file_tag.id}
                      className=" text-blue-500"
                    >
                      {tag.file_tag.name}
                    </Link>
                    <span
                      className={
                        index === fileData.data?.tags.length - 1
                          ? "hidden"
                          : ""
                      }
                    >
                      {", "}
                    </span>
                  </span>
                )) || "-"
            }
          />
          <InfoBar
            label="Authors"
            value={
              fileData.data?.authors
                .sort((a, b) => a.order - b.order)
                .map((author, index) => (
                  <span  key={author.file_author.id}>
                    <Link
                      href={"/author/" + author.file_author.id}
                      className=" text-blue-500"
                    >
                      {author.file_author.name}
                    </Link>
                    <span
                      className={
                        index === fileData.data?.authors.length - 1
                          ? "hidden"
                          : ""
                      }
                    >
                      {", "}
                    </span>
                  </span>
                )) || "-"
            }
          />
          <InfoBar
            label="Uploaded by"
            value={
              fileData.data?.uploader?.username ? (
                <Link
                  className="text-blue-500"
                  href={`/u/${fileData.data?.uploader?.id || ""}`}
                >
                  {fileData.data.uploader.username}
                </Link>
              ) : (
                <span className="text-red-400">Unknown</span>
              )
            }
          />
          <InfoBar label="Type" value={fileData.data?.type || "-"} />
          <InfoBar
            label="Size"
            value={
              ((fileData.data?.size_bytes ?? 0) / (1024 * 1024)).toFixed(2) +
              " MB"
            }
          />
          <InfoBar
            label="Download Count"
            value={fileData.data?.download_count || 0}
          />
          <DownloadButton
            file_id={fileData.data?.id || ""}
            file_title={fileData.data?.title}
            className=" mt-4"
          />
        </div>
      </div>
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
