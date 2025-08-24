import supabase from "@/lib/supabase";

export async function getUserByUsername(username: string) {
  if (!username) {
    throw new Error("User username is required.");
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}
