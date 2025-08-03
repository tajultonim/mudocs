"use server";

import supabase from "@/lib/supabase";
import { toSlug } from "@/lib/text-helper";
import { revalidateSSGPath } from "./revalidation";

export async function create(name: string) {
  if (!name.trim().length || !/^[a-zA-Z0-9 ]+$/.test(name)) {
    return { status: "error", message: "Invalid tag name." };
  }
  const nname = name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const { data, error } = await supabase
    .from("tags")
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

export async function getTagInfo(tagId: string) {
  if (!tagId) {
    throw new Error("Tag ID is required.");
  }

  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("id", tagId)
    .single();

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  return data;
}
