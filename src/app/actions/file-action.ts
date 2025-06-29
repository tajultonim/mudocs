"use server";

import { generateUploadSASUrl, generateDownloadSASUrl } from "@/lib/azure";
import supabase from "@/lib/supabase";
import { cookies } from "next/headers";
import { validateUser } from "./auth-action";

export async function getSasUrl(hash: string, container: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const vres = await validateUser(accessToken as string);
  if (vres.status !== "success") {
    throw new Error("Access denied.");
  }

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
  return generateUploadSASUrl(hash, container);
}

export async function create({
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

  const { data, error } = await supabase.rpc("create_file", {
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
    author_ids: authors,
    user_id: (vres.data.id || null) as string,
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
  const downloadURL = await generateDownloadSASUrl(res.data, "document-files");

  return { status: "success", data: downloadURL };
}

export async function getFilesByTagId(
  tagId: string,
  from: number = 0,
  to: number = 36
) {
  if (!tagId) {
    throw new Error("Tag ID is required.");
  }

  const { data, error } = await supabase
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
    `
    )
    .eq("tag_id", tagId)
    .order("download_count", { foreignTable: "files", ascending: false })
    .range(from, to, { foreignTable: "files" });

  if (error) {
    throw new Error(error.message);
  }
  return data.map((f) => f.files);
}

export async function getFilesByAuthorId(
  authorId: string,
  from: number = 0,
  to: number = 36
) {
  if (!authorId) {
    throw new Error("Author ID is required.");
  }

  const { data, error } = await supabase
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
  `
    )
    .eq("author_id", authorId)
    .order("download_count", { foreignTable: "files", ascending: false })
    .range(from, to, { foreignTable: "files" });

  if (error) {
    throw new Error(error.message);
  }
  return data.map((f) => f.files);
}

export async function getFilesByUserId(
  userId: string,
  from: number = 0,
  to: number = 36
) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const { data, error } = await supabase
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
    `
    )
    .eq("uploader_id", userId)
    .order("download_count", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getFilesByRange(
  from: number = 0,
  to: number = 36,
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
