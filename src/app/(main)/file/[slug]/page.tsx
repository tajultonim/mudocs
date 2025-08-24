import supabase from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  Fingerprint,
  Hash,
  Languages,
  LucideIcon,
  Link as LinkIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import OnlineList from "./online-list";
import { Divider } from "@/components/divider";
import { hyphenateISBN } from "@/lib/text-helper";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fileData = await supabase
    .from("documents")
    .select("title, description")
    .is("deleted_at", null)
    .eq("status", "live")
    .eq("id", slug)
    .single();

  if (!fileData.data) {
    return {
      title: "404 - File Not Found",
      description: "The requested file could not be found.",
      openGraph: {
        title: "404 - File Not Found",
        description: "The requested file could not be found.",
      },
      twitter: {
        card: "summary_large_image",
        title: "404 - File Not Found",
        description: "The requested file could not be found.",
      },
      robots: {
        index: false,
        follow: false,
        noimageindex: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      },
    };
  }

  return {
    title: `${fileData.data?.title} | μDocs`,
    description:
      fileData.data?.description || `${fileData.data?.title || ""} at μDocs`,
    openGraph: {
      title: `${fileData.data?.title} | μDocs`,
      description:
        fileData.data?.description || `${fileData.data?.title || ""} at μDocs`,
      url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/file/${slug}`,
      images: [
        {
          url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/file/${slug}/og-image`,
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
      title: `${fileData.data?.title} | μDocs`,
      description:
        fileData.data?.description ||
        `${fileData.data?.title || ""} from μDocs`,
      images: [
        `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/file/${slug}/og-image`,
      ],
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
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
    .from("documents")
    .select(
      `*,
      authors:document_author!document_author_document_id_fkey(
        document_author:authors!document_author_author_id_fkey(name,id,slug),
        order
      ),
      tags:document_tag!document_tag_document_id_fkey(
        document_tag:tags!document_tag_tag_id_fkey(name,id,slug)
      ),
      uploader:users(id, username),
      files(*,publisher:publishers(name,slug),uploader:users(id)),
      pdl(*,publisher:publishers(name,slug))
    `
    )
    .eq("id", slug)
    .is("deleted_at", null)
    .eq("status", "live")
    .order("order", { referencedTable: "files", ascending: true })
    .single();

  const data = fileData.data;
  const fileType = data?.type || "other";

  function IconLabel({
    Icon,
    children,
    className,
  }: {
    Icon: LucideIcon;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <div className={`flex gap-2 ${className}`}>
        <Icon size={18} className="h-6" />
        <div>{children}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <>
        <h1 className="text-2xl font-bold">File not found</h1>
      </>
    );
  }

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
              name: author.document_author.name,
            })),
            datePublished: "2003-10-01",
            isbn: (data?.extra_meta as { isbn?: string })?.isbn,
            inLanguage: data?.language,
            description: data?.description,
            ...(fileType == "note" && { educationalLevel: "University" }),
            image: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/file/${data?.id}/og-image`,
            url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/file/${data?.id}`,
            keywords: data?.tags.map((tag) => tag.document_tag.name),
            potentialAction: {
              "@type": "ViewAction",
              target: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/file/${data?.id}`,
            },
          }).replace(/</g, "\\u003c"),
        }}
      />
      <div className="flex flex-col gap-2">
        <div className="p-2 md:p-8 py-2 rounded-xl w-full flex flex-col md:flex-row gap-8 items-center md:items-start">
          <Image
            src={`/remote/${fileData.data?.cover_path}`}
            alt={fileData.data?.title || "Book Cover"}
            width={250}
            height={350}
            quality={1}
            className="rounded aspect-[64/94] object-cover border"
          />
          <div className="flex-1 w-full">
            <div className="flex gap-2">
              {fileData.data.tags.map((tag) => (
                <Link
                  key={tag.document_tag.id}
                  href={`/tag/${tag.document_tag.slug}`}
                >
                  <div className=" bg-slate-500 inline-block rounded-xl px-2 text-white text-sm hover:bg-slate-600 whitespace-nowrap">
                    {tag.document_tag.name}
                  </div>
                </Link>
              ))}
            </div>
            <h1 className="text-2xl mt-1 font-bold">{fileData.data?.title}</h1>
            <div className="flex">
              {fileData.data.authors.map((a, i) => (
                <Link
                  key={a.document_author.slug}
                  className=" hover:underline"
                  href={`/author/${a.document_author.slug}`}
                >
                  {a.document_author.name}
                  {i == fileData.data.authors.length - 1 ? "" : ", "}
                </Link>
              ))}
            </div>
            <Divider />
            {fileData.data?.description && (
              <div className="mt-2 rounded p-2">
                {fileData.data?.description}
              </div>
            )}
            {fileData.data?.language && (
              <>
                <IconLabel className="mt-2" Icon={Languages}>
                  <span className=" font-semibold mr-2 text-sm">Language</span>
                  {fileData.data.language == "en"
                    ? "English"
                    : fileData.data.language == "bn"
                    ? "Bengali"
                    : "Unknown"}
                </IconLabel>
              </>
            )}
            {(fileData.data.isbn_13 ||
              fileData.data.doi ||
              fileData.data.ddc) && (
              <IconLabel className="mt-2" Icon={Fingerprint}>
                {fileData.data.isbn_13 && (
                  <div>
                    <span className=" font-semibold mr-2 text-sm">ISBN</span>
                    {fileData.data.isbn_13
                      .map((isbn) => hyphenateISBN(isbn))
                      .join(", ")}
                  </div>
                )}
                {fileData.data.doi && (
                  <div>
                    <span className=" font-semibold mr-2 text-sm">DOI</span>
                    <Link
                      href={`https://doi.org/${fileData.data.doi}`}
                      className="hover:underline"
                    >
                      {fileData.data.doi}
                    </Link>
                  </div>
                )}
                {fileData.data.ddc && (
                  <div>
                    <span className=" font-semibold mr-2 text-sm">DDC</span>
                    {fileData.data.ddc}
                  </div>
                )}
              </IconLabel>
            )}
            {!!fileData.data?.pdl.length && (
              <>
                <Link className="group" href={`/explore/s-lib/`}>
                  <h2 className="text-lg font-semibold mt-4">
                    Seminar Library
                    <LinkIcon
                      size={16}
                      className="inline-block ml-1 group-hover:text-slate-500"
                    />
                  </h2>
                </Link>
                <Divider />
                {!!fileData.data?.pdl.length && (
                  <IconLabel className=" mt-2" Icon={Hash}>
                    {!!fileData.data?.pdl?.filter((e) => !e.is_rental)
                      .length && (
                      <div>
                        <span className=" font-semibold mr-2 text-sm">
                          Reading Room
                        </span>
                        {fileData.data?.pdl?.filter((e) => !e.is_rental).length}
                      </div>
                    )}
                    {!!fileData.data?.pdl?.filter((e) => e.is_rental)
                      .length && (
                      <div>
                        <span className=" font-semibold mr-2 text-sm">
                          Rental
                        </span>
                        {fileData.data?.pdl?.filter((e) => e.is_rental).length}
                      </div>
                    )}
                  </IconLabel>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>PDL NO.</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Publisher</TableHead>
                      <TableHead>Year</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fileData.data.pdl.map((pdl, index) => (
                      <TableRow key={pdl.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{pdl.pdl_no}</TableCell>
                        <TableCell>
                          {pdl.is_rental ? "Rental Library" : "Reading Room"}
                        </TableCell>
                        <TableCell>
                          <Link
                            className="hover:underline"
                            href={`/publisher/${pdl.publisher?.slug}`}
                          >
                            {pdl.publisher?.name}
                          </Link>
                        </TableCell>
                        <TableCell>{pdl.year}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
            <OnlineList files={fileData.data?.files || []} />
          </div>
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const res = await supabase
    .from("files")
    .select("id")
    .is("deleted_at", null)
    .neq("status", "uploading"); // returns list of books
  const books = res.data || [];
  return books.map((book: { id: string }) => ({
    slug: book.id,
  }));
}
