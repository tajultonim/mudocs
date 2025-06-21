"use server";

import { generateUploadSASUrl, generateDownloadSASUrl } from "@/lib/azure";
import supabase from "@/lib/supabase";

export async function getSasUrl(hash: string, container: string) {
  if (!hash || !container) {
    return new Error("Missing required parameters: hash or container.");
  }
  const efile = await supabase
    .from("files")
    .select("id")
    .eq("sha256_hash", hash)
    .single();
  if (efile.data) {
    return new Error("File already exists in the database.");
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
  user_id,
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
  user_id?: string;
}) {
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
    user_id: (user_id || null) as string,
  });
  if (error) {
    console.log(error);
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
