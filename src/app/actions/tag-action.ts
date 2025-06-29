import supabase from "@/lib/supabase";

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
    console.log(error)
    throw new Error(error.message);
  }
  
  return data;
}
