"use server";

import supabase from "@/lib/supabase";
import {
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
  SASProtocol,
} from "@azure/storage-blob";

export async function getSasUrl(hash: string, container: string) {
  const account = process.env.AZURE_STORAGE_ACCOUNT;
  const accountKey = process.env.AZURE_STORAGE_KEY;

  if (!account || !accountKey) {
    throw new Error("Azure Storage account or key is not defined.");
  }
  if (!hash || !container) {
    throw new Error("Hash and container must be provided.");
  }

  const sharedKeyCredential = new StorageSharedKeyCredential(
    account,
    accountKey
  );
  const permissions = BlobSASPermissions.parse("cw");
  const expiresOn = new Date(new Date().valueOf() + 3600 * 1000); // 1 hour

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: container,
      blobName: hash,
      permissions,
      expiresOn,
      protocol: SASProtocol.HttpsAndHttp,
    },
    sharedKeyCredential
  ).toString();

  console.log(sasToken);

  return `https://${account}.blob.core.windows.net/${container}/${hash}?${sasToken}`;
}

export async function create({
  title,
  file_path,
  sha256_hash,
  mime_type,
  size_bytes,
  type,
  category,
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
  category: string;
  tags: string[];
  authors: string[];
  description?: string;
  isbn?: string;
  doi?: string;
  cover_path?: string;
}) {
  if (
    !sha256_hash ||
    !file_path ||
    !mime_type ||
    !type ||
    !size_bytes ||
    !title ||
    !category
  ) {
    return { status: "error", message: "Missing required fields." };
  }

  const fileres = await supabase
    .from("files")
    .insert({
      title,
      file_path,
      sha256_hash,
      mime_type,
      size_bytes,
      type,
      description,
      extra_meta: {
        isbn,
        doi,
      },
      cover_path,
    })
    .select("id")
    .single();
  if (fileres.error) {
    return { status: "error", message: fileres.error.message };
  }

  await Promise.all([
    ...tags.map((id) =>
      supabase
        .from("file_tags")
        .insert({ file_id: fileres.data.id, tag_id: id })
    ),
    ...authors.map((id, index) =>
      supabase
        .from("file_authors")
        .insert({ file_id: fileres.data.id, author_id: id, order: index })
    ),
  ]);
  return {
    status: "success",
    message: "File metadata created successfully.",
    data: fileres.data,
  };
}
