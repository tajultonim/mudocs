"use server";

import supabase from "@/lib/supabase";

export async function searchWithQuery(query: string) {
  if (!query.trim()) {
    return { status: "error", message: "Query cannot be empty." };
  }

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
    ),
    type
  `
    )
    .ilike("title", `%${query}%`);

  if (fileQuery.error) {
    console.log(fileQuery.error);
    return { status: "error", message: "Failed to fetch search results." };
  }

  return { status: "success", results: fileQuery.data };
}
