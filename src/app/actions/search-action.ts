"use server";

import supabase from "@/lib/supabase";


function supabasequery(query:string){
  return supabase
    .from("documents")
    .select(
      `
    id,
    title,
    cover_path,
    authors:document_author!document_author_document_id_fkey(
        entry:authors!document_author_author_id_fkey(name,id,slug),
        order
      ),
    type
  `
    )
    .ilike("title", `%${query}%`);
}

export type ResultType = NonNullable<Awaited<ReturnType<typeof supabasequery>>["data"]>[number];

export async function searchWithQuery(
  query: string
): Promise<
  { status: "error"; message: string } | { status: "success"; results: ResultType[] }
> {
  if (!query.trim()) {
    return { status: "error", message: "Query cannot be empty." };
  }

  const fileQuery = await supabasequery(query)

  if (fileQuery.error) {
    console.log(fileQuery.error);
    return { status: "error", message: "Failed to fetch search results." };
  }

  return { status: "success", results: fileQuery.data as ResultType[] };
}
