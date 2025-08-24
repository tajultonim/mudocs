"use server";

import supabase from "@/lib/supabase";
import { revalidateSSGPath } from "./revalidation";
import { toSlug } from "@/lib/text-helper";

export async function create(
  name: string
): Promise<
  | { status: "error"; message: string }
  | { status: "success"; data: { id: string; name: string } }
> {
  if (
    !name.trim().length ||
    !/^[a-zA-Z0-9 .]+$/.test(
      name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    )
  ) {
    return { status: "error", message: "Invalid author name." };
  }
  const nname = name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const { data, error } = await supabase
    .from("authors")
    .insert({
      name: nname,
      slug: toSlug(name),
    })
    .select("id,name")
    .single();
  await revalidateSSGPath("/upload");
  if (error) {
    return { status: "error", message: error.message };
  }
  return { status: "success", data };
}

export async function getAuthorBySlug(authorSlug: string) {
  if (!authorSlug) {
    throw new Error("Author slug is required.");
  }

  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .eq("slug", authorSlug)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
