"use server";

import supabase from "@/lib/supabase";

export async function create(name: string) {
  let { data, error } = await supabase.from("tags").insert({ name });
  if(error){
    return {status:"error", message:error.message};
  }
  return {status:"success", data};
}
