"use server";

import supabase from "@/lib/supabase";
import { revalidateSSGPath } from "./revalidation";
import { toSlug } from "@/lib/text-helper";

export async function create(name: string) {
  if (!name.trim().length || !/[^a-zA-Z0-9]/.test(name)) {
    return;
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
    .select("id")
    .single();
  await revalidateSSGPath("/upload");
  if (error) {
    return { status: "error", message: error.message };
  }
  return { status: "success", data };
}

export async function getAuthorById(authorId: string) {
  if (!authorId) {
    throw new Error("Author ID is required.");
  }

  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .eq("id", authorId)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
