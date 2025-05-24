"use server";

import supabase from "@/lib/supabase";

export async function create(name: string) {
  if (!name.trim().length || !/[^a-zA-Z0-9]/.test(name)) {
    return;
  }

  console.log(name)
  const nname = name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const { data, error } = await supabase.from("authors").insert({
    name: nname,
    slug: name.trim().replace(/\s+/g, "-").toLowerCase(),
  });
  if (error) {
    return { status: "error", message: error.message };
  }
  return { status: "success", data };
}
