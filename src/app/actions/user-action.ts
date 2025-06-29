import supabase from "@/lib/supabase";

export async function getUrserById(userId: string) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}
