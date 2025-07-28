import InfoBar from "@/components/info-bar";
import supabase from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import ButtonSet from "./buttonset";
import { Metadata } from "next";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fileData = await supabase
    .from("files")
    .select("title, description, cover_path")
    .eq("id", slug)
    .single();
  return {
    title: fileData.data?.title || "File",
    description:
      fileData.data?.description ||
      `Download file ${fileData.data?.title || ""} from μDocs`,
    openGraph: {
      title: fileData.data?.title || "File",
      description:
        fileData.data?.description ||
        `Download file ${fileData.data?.title || ""} from μDocs`,
      url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/file/${slug}`,
      images: [
        {
          url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/remote/${fileData.data?.cover_path}`,
          width: 1200,
          height: 850,
          alt: fileData.data?.title || "File",
        },
      ],
      siteName: "μDocs",
      type: "book",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fileData.data?.title || "File",
      description:
        fileData.data?.description ||
        `Download file ${fileData.data?.title || ""} from μDocs`,
      images: [
        `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/remote/${fileData.data?.cover_path}`,
      ],
    },
  };
}

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
      uploader:users(id, username),
      publisher:publishers(id, name)
    `
    )
    .eq("id", slug).is("deleted_at",null)
    .single();
  const data = fileData.data;
  const fileType = data?.type || "other";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type":
              fileType === "book"
                ? "Book"
                : fileType == "paper"
                ? "ScholarlyArticle"
                : fileType == "note"
                ? "CreativeWork"
                : "MediaObject",
            name: data?.title,
            author: data?.authors.map((author) => ({
              "@type": "Person",
              name: author.file_author.name,
            })),
            bookFormat: data?.file_path
              ? "https://schema.org/EBook"
              : undefined,
            ...(data?.publisher?.name && {
              "@type": "Organization",
              name: data?.publisher?.name,
            }),
            datePublished: "2003-10-01",
            isbn: (data?.extra_meta as { isbn?: string })?.isbn,
            inLanguage: data?.language,
            description: data?.description,
            ...(fileType == "note" && { educationalLevel: "University" }),
            image: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/remote/${data?.cover_path}`,
            url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/file/${data?.id}`,
            keywords: data?.tags.map((tag) => tag.file_tag.name),
            potentialAction: {
              "@type": "ReadAction",
              target: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/file/${data?.id}`,
            },
          }).replace(/</g, "\\u003c"),
        }}
      />
      <div className="flex flex-col gap-2">
        <div className="p-8 py-2 rounded w-full flex flex-col md:flex-row gap-8 items-center">
          <Image
            src={`/remote/${fileData.data?.cover_path}`}
            alt={fileData.data?.title || "Book Cover"}
            width={250}
            height={350}
            quality={1}
            className="rounded"
          />
          <div className="flex-1 w-full">
            <h1 className="text-2xl font-bold mb-4">{fileData.data?.title}</h1>
            <InfoBar
              label="Description"
              value={fileData.data?.description || "-"}
            />
            <InfoBar
              label="Tags"
              value={
                fileData.data?.tags.map((tag, index) => (
                  <span key={tag.file_tag.id}>
                    <Link
                      href={"/tag/" + tag.file_tag.id}
                      className=" text-blue-500"
                    >
                      {tag.file_tag.name}
                    </Link>
                    <span
                      className={
                        index === fileData.data?.tags.length - 1 ? "hidden" : ""
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
                    <span key={author.file_author.id}>
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
            <div className="mt-4">
              <ButtonSet
                id={fileData.data?.id || ""}
                title={fileData.data?.title || ""}
                uploader_id={fileData.data?.uploader?.id || ""}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const res = await supabase.from("files").select("id").is("deleted_at",null); // returns list of books
  const books = res.data || [];

  return books.map((book: { id: string }) => ({
    slug: book.id,
  }));
}
