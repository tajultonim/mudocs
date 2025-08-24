"use server";

import { generateUploadSASUrl, generateDownloadSASUrl } from "@/lib/azure";
import supabase from "@/lib/supabase";
import { cookies } from "next/headers";
import { validateUser } from "./auth-action";
import { revalidateSSGPath } from "./revalidation";

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
    .neq("status", "uploading");

  if (efile.data?.length) {
    throw new Error("File already exists in the database.");
  } else if (efile.error) {
    throw new Error(efile.error.message);
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
  await revalidateSSGPath("/file/" + id);
  return true;
}

export async function deleteFile(id: string): Promise<{
  status: string;
  message: string;
}> {
  if (!id) {
    return { status: "error", message: "File ID is required." };
  }
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const vres = await validateUser(accessToken as string);
  if (vres.status !== "success" || !vres.data) {
    return { status: "error", message: "Access denied!" };
  }

  if (vres.data.roles.includes("admin")) {
    const { error } = await supabase
      .from("documents")
      .update({ deleted_at: new Date().toISOString() })
      .is("deleted_at", null)
      .eq("id", id);
    if (error) {
      return { status: "error", message: error.message };
    }
    await revalidateSSGPath("/file/" + id);
    return { status: "success", message: "File deleted successfully." };
  }
  const { error, data } = await supabase
    .from("documents")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("uploader_id", vres.data.id)
    .select("id");

  if (error) {
    return { status: "error", message: error.message };
  }
  if (!data?.length) {
    return { status: "error", message: "File not found or access denied." };
  }
  await revalidateSSGPath("/file/" + id);
  return { status: "success", message: "File deleted successfully." };
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

  const { data: predata, error: predataError } = await supabase
    .from("files")
    .select("id")
    .eq("sha256_hash", sha256_hash)
    .neq("status", "uploading");

  if (predata?.length || predataError) {
    console.log(predataError);
    return {
      status: "error",
      message: predata?.length
        ? "File already exists"
        : "Error fetching file data",
    };
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
    .from("document_tag")
    .select(
      `
      documents (
        id,
        title,
        download_count,
        authors:document_author!document_author_document_id_fkey(
        entry:authors!document_author_author_id_fkey(name,id,slug),
          order
        ),
        cover_path
      )
    `,
      { count: "exact" }
    )
    .eq("tag_id", tagId)
    .order("download_count", { referencedTable: "documents", ascending: false })
    .range(from, to, { referencedTable: "documents" });

  if (error) {
    throw new Error(error.message);
  }
  return { data: data.map((f) => f.documents), count: count || 0 };
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
    .from("document_author")
    .select(
      `
    documents (
      id,
      title,
      download_count,
      authors:document_author!document_author_document_id_fkey(
        entry:authors!document_author_author_id_fkey(name,id,slug),
        order
      ),
      cover_path
    )
  `,
      { count: "exact" }
    )
    .eq("author_id", authorId)
    .order("download_count", { foreignTable: "documents", ascending: false })
    .range(from, to, { foreignTable: "documents" });

  if (error) {
    throw new Error(error.message);
  }
  return { data: data.map((f) => f.documents) || [], count: count || 0 };
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
    .from("documents")
    .select(
      `
      id,
      title,
      cover_path,
      download_count,
      authors:document_author!document_author_document_id_fkey(
        entry:authors!document_author_author_id_fkey(name,id,slug),
        order
      )
    `,
      { count: "exact" }
    )
    .is("deleted_at", null)
    .neq("status", "uploading")
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
  if (category == "bookmarks") {
    return { data: [], count: 0 };
  }

  if (type) {
    if (category == "s-lib") {
      res = await supabase
        .from("documents")
        .select(
          `
          id,
          title,
          download_count,
          authors:document_author!document_author_document_id_fkey(
            entry:authors!document_author_author_id_fkey(name,id,slug),
            order
          ),
          cover_path,
          pdl!inner(id)
    `,
          { count: "exact" }
        )
        .is("deleted_at", null)
        .eq("status", "live")
        .eq("type", type)
        .order(orderBy, { ascending })
        .range(from, to);
    } else {
      res = await supabase
        .from("documents")
        .select(
          `
      id,
      title,
      download_count,
      authors:document_author!document_author_document_id_fkey(
        entry:authors!document_author_author_id_fkey(name,id,slug),
        order
      ),
      cover_path
    `,
          { count: "exact" }
        )
        .is("deleted_at", null)
        .eq("status", "live")
        .eq("type", type)
        .order(orderBy, { ascending })
        .range(from, to);
    }
  } else {
    if (category == "s-lib") {
      res = await supabase
        .from("documents")
        .select(
          `
          id,
          title,
          download_count,
          authors:document_author!document_author_document_id_fkey(
            entry:authors!document_author_author_id_fkey(name,id,slug),
            order
          ),
          cover_path,
          pdl!inner(id)
    `,
          { count: "exact" }
        )
        .is("deleted_at", null)
        .eq("status", "live")
        .order(orderBy, { ascending })
        .range(from, to);
    } else {
      res = await supabase
        .from("documents")
        .select(
          `
      id,
      title,
      authors:document_author!document_author_document_id_fkey(
        entry:authors!document_author_author_id_fkey(name,id,slug),
        order
      ),
      cover_path
    `,
          { count: "exact" }
        )
        .is("deleted_at", null)
        .eq("status", "live")
        .order(orderBy, { ascending })
        .range(from, to);
    }
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
    .from("documents")
    .select(
      `
      *,
      authors:document_author!document_author_document_id_fkey(
        entry:authors!document_author_author_id_fkey(name,id,slug),
        order
      )
    `
    )
    .is("deleted_at", null)
    .neq("status", "uploading")
    .order(orderBy, { ascending })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

type FilesWithPublisherQuery = {
  id: string;
  title: string;
  cover_path: string;
  download_count: number | null;
  authors: {
    entry: {
      name: string;
      id: string;
      slug: string;
    };
    order: number;
  }[];
}[];

export async function getFilesByPublisherId(
  publisherId: string,
  from: number = 0,
  to: number = 17
) {
  if (!publisherId) {
    throw new Error("Publisher ID is required.");
  }

  const { data, count, error } = await supabase
    .from("document_with_publishers")
    .select(
      `
      id,
      title,
      cover_path,
      download_count,
      authors:document_author!document_author_document_id_fkey(
        entry:authors!document_author_author_id_fkey(name,id,slug),
        order
      )
  `,
      { count: "exact" }
    )
    .or(
      `file_publisher_id.eq.${publisherId},pdl_publisher_id.eq.${publisherId}`
    )
    .order("download_count", { ascending: false })
    .range(from, to);
  if (error) {
    console.log(error);
    throw new Error(error.message);
  }
  return { data: (data as FilesWithPublisherQuery) || [], count: count || 0 };
}
