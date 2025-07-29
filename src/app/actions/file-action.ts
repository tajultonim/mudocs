"use server";

import { generateUploadSASUrl, generateDownloadSASUrl } from "@/lib/azure";
import supabase from "@/lib/supabase";
import { cookies } from "next/headers";
import { validateUser } from "./auth-action";

export async function getSasUrl(r_path: string) {
  const container = r_path.split("/")[0];
  const hash = r_path.split("/")[1].split(".")[0];
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const vres = await validateUser(accessToken as string);
  if (vres.status !== "success") {
    throw new Error("Access denied.");
  }
  // 28, 35, 36, e0, e7
  //28, 35, 36, e0
  if (!hash || !container) {
    throw new Error("Missing required parameters: hash or container.");
  }
  const efile = await supabase
    .from("files")
    .select("id")
    .eq("sha256_hash", hash)
    .single();
  if (efile.data) {
    throw new Error("File already exists in the database.");
  }
  return generateUploadSASUrl(r_path);
}

export async function uploadComplete(id: string) {
  if (!id) {
    return false;
  }
  const { error } = await supabase
    .from("files")
    .update({ status: "live" })
    .eq("id", id);
  if (error) {
    return false;
  }
  return true;
}

export async function createUpload({
  title,
  file_path,
  sha256_hash,
  mime_type,
  size_bytes,
  type,
  tags,
  authors,
  description,
  isbn,
  doi,
  cover_path,
  publisher_id,
  year,
  language = "en",
}: {
  title: string;
  file_path: string;
  sha256_hash: string;
  mime_type: string;
  size_bytes: number;
  type: string;
  tags: string[];
  authors: string[];
  description?: string;
  isbn?: string;
  doi?: string;
  cover_path?: string;
  publisher_id?: string;
  year?: string;
  language?: string;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const vres = await validateUser(accessToken as string);
  if (vres.status !== "success" || !vres.data) {
    return { status: "error", message: "Access denied!" };
  }

  if (
    !sha256_hash ||
    !file_path ||
    !mime_type ||
    !type ||
    !size_bytes ||
    !title
  ) {
    return { status: "error", message: "Missing required fields." };
  }

  const { data, error } = await supabase.rpc("create_file_upload", {
    title,
    file_path,
    hash: sha256_hash,
    mime_type,
    size_bytes,
    type,
    description: description || "",
    extra_meta: { isbn, doi },
    cover_path: cover_path || "",
    tag_ids: tags,
    year: year,
    publisher_id: publisher_id,
    author_ids: authors,
    user_id: vres.data.id as string,
    language: language,
  });
  if (error) {
    return { status: "error", message: error.message };
  }
  return {
    status: "success",
    message: "File metadata created successfully.",
    data: data,
  };
}

export async function createDownload(file_id: string, user_id: string) {
  console.log(user_id);

  if (!file_id) {
    return { status: "error", message: "Missing required fields." };
  }
  const res = await supabase.rpc("increase_download_count", {
    file_id,
  });

  if (res.error || !res.data) {
    return { status: "error", message: res.error?.message };
  }
  const downloadURL = await generateDownloadSASUrl(res.data);

  return { status: "success", data: downloadURL };
}


export async function getFilesByTagId(
  tagId: string,
  from: number = 0,
  to: number = 17
) {
  if (!tagId) {
    throw new Error("Tag ID is required.");
  }

  const { data, count, error } = await supabase
    .from("file_tags")
    .select(
      `
      files (
        id,
        title,
        cover_path,
        download_count,
        file_authors!file_authors_file_id_fkey (
          authors!file_authors_author_id_fkey (
            id,
            name,
            slug
          ),
          order
        )
      )
    `,
      { count: "exact" }
    )
    .eq("tag_id", tagId)
    .order("download_count", { foreignTable: "files", ascending: false })
    .range(from, to, { foreignTable: "files" });

  if (error) {
    throw new Error(error.message);
  }
  return { data: data.map((f) => f.files), count: count || 0 };
}

export async function getFilesByAuthorId(
  authorId: string,
  from: number = 0,
  to: number = 17
) {
  if (!authorId) {
    throw new Error("Author ID is required.");
  }

  const { data, count, error } = await supabase
    .from("file_authors")
    .select(
      `
    files (
      id,
      title,
      cover_path,
      download_count,
      file_authors!file_authors_file_id_fkey (
        authors!file_authors_author_id_fkey (
          id,
          name,
          slug
        ),
        order
      )
    )
  `,
      { count: "exact" }
    )
    .eq("author_id", authorId)
    .order("download_count", { foreignTable: "files", ascending: false })
    .range(from, to, { foreignTable: "files" });

  if (error) {
    throw new Error(error.message);
  }
  return { data: data.map((f) => f.files) || [], count: count || 0 };
}

export async function getFilesByUserId(
  userId: string,
  from: number = 0,
  to: number = 17
) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const { data, count, error } = await supabase
    .from("files")
    .select(
      `
      id,
      title,
      cover_path,
      download_count,
      file_authors!file_authors_file_id_fkey (
        authors!file_authors_author_id_fkey (
          id,
          name,
          slug
        ),
        order
      )
    `,
      { count: "exact" }
    )
    .eq("uploader_id", userId)
    .order("download_count", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }
  return { data: data || [], count: count || 0 };
}

export async function getFilesByCategoryTypeByRange({
  from = 0,
  to = 17,
  category,
  type,
  orderBy = "download_count",
  ascending = false,
}: {
  from?: number;
  to?: number;
  category?: string;
  type?: string;
  orderBy?: string;
  ascending?: boolean;
}) {
  let res = null;
  if (category == "bookmarks" || category == "s-lib") {
    return { data: [], count: 0 };
  }
  if (type) {
    res = await supabase
      .from("files")
      .select(
        `
      id,
      title,
      cover_path,
      download_count,
      file_authors!file_authors_file_id_fkey (
        authors!file_authors_author_id_fkey (
          id,
          name,
          slug
        ),
        order
      )
    `,
        { count: "exact" }
      )
      .eq("type", type)
      .order(orderBy, { ascending })
      .range(from, to);
  } else {
    res = await supabase
      .from("files")
      .select(
        `
      *,
      file_authors!file_authors_file_id_fkey (
        authors!file_authors_author_id_fkey (
          id,
          name,
          slug
        ),
        order
      )
    `,
        { count: "exact" }
      )
      .order(orderBy, { ascending })
      .range(from, to);
  }
  if (res.error) {
    return { data: [], count: 0 };
  }
  return { data: res.data, count: res.count || 0 };
}

export async function getFilesByRange(
  from: number = 0,
  to: number = 35,
  orderBy: string = "download_count",
  ascending: boolean = false
) {
  const { data, error } = await supabase
    .from("files")
    .select(
      `
      *,
      file_authors!file_authors_file_id_fkey (
        authors!file_authors_author_id_fkey (
          id,
          name,
          slug
        ),
        order
      )
    `
    )
    .order(orderBy, { ascending })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
