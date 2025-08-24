"use server";

import supabase from "@/lib/supabase";
import { toSlug } from "@/lib/text-helper";
import { revalidateSSGPath } from "./revalidation";

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
    return { status: "error", message: "Invalid publisher name." };
  }
  const nname = name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const { data, error } = await supabase
    .from("publishers")
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

export async function getPublisherBySlug(publisherSlug: string) {
  if (!publisherSlug) {
    throw new Error("Publisher slug is required.");
  }

  const { data, error } = await supabase
    .from("publishers")
    .select("*")
    .eq("slug", publisherSlug)
    .single();

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  return data;
}
