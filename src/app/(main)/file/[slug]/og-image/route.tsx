//An next js og image generator function. A banner with the book cover url, title and author name and it will put the cover on the banner the banner will have the title of the website

import supabase from "@/lib/supabase";
import { NextApiRequest } from "next";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Image metadata
export const alt = "File cover";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export async function GET(
  req: NextApiRequest,
  { params }: { params: { slug: string } }
) {
  const p = await params;
  const slug = p.slug;

  const fileData = await supabase
    .from("files")
    .select(
      `cover_path,title,
      authors:file_authors!file_authors_file_id_fkey(
        file_author:authors!file_authors_author_id_fkey(name,id,slug),
        order
      )
    `
    )
    .eq("id", slug)
    .is("deleted_at", null)
    .single();

  return new ImageResponse(
    (
      <div tw="p-10 w-full h-full bg-white flex justify-center">
        <div tw=" flex w-full gap-2 bg-slate-100 rounded-lg justify-center p-6">
          <img
            src={`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/remote/${fileData.data?.cover_path}`}
            alt="Book Cover"
            tw=" aspect-[94/64] ml-35 h-full rounded-lg "
          />
          <div tw=" flex flex-col h-full pl-10 justify-center">
            <h1 tw=" text-6xl font-bold">
              <span tw=" text-blue-500">μ</span>Docs
            </h1>
            <h1
              style={{ whiteSpace: "pre-wrap" }}
              tw=" w-[80%] text-4xl font-semibold mb-0 mt-4"
            >
              {fileData.data?.title}
            </h1>
            <p
              style={{ whiteSpace: "pre-wrap" }}
              tw=" w-[80%] text-3xl text-gray-800 mt-0"
            >
              {fileData.data?.authors.map((a) => a.file_author.name).join(", ")}
            </p>
            <p
              style={{ whiteSpace: "pre-wrap" }}
              tw=" w-[80%] text-2xl mt-4 mb-0"
            >
              Explore books, papers, notes including
              {" "+fileData.data?.title} by{" "}
              {fileData.data?.authors.map((a) => a.file_author.name).join(", ")} at μDocs
            </p>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: await loadFont("Regular"),
          style: "normal",
          weight: 400,
        },
        {
          name: "Geist",
          data: await loadFont("Medium"),
          style: "normal",
          weight: 500,
        },
        {
          name: "Geist",
          data: await loadFont("Semibold"),
          style: "normal",
          weight: 600,
        },
        {
          name: "Geist",
          data: await loadFont("Bold"),
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}

async function loadFont(type: string) {
  return await readFile(join(process.cwd(), `public/assets/Geist-${type}.ttf`));
}
