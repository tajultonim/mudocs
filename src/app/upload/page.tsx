import UploadForm from "@/components/upload-form";
import supabase from "@/lib/supabase";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "μDocs - Upload",
};
export default async function UploadPage() {
  const authorQuery = supabase.from("authors").select("*");
  const tagsQuery = supabase.from("tags").select("*");
  const [authors, tags] = await Promise.all([authorQuery, tagsQuery]);
  if (authors.error || tags.error) {
    console.error(
      "Error fetching authors or tags:",
      authors.error || tags.error
    );
    return <div>Error fetching data</div>;
  }

  return (
    <div className="w-full flex justify-center">
      <UploadForm tags={tags.data} authors={authors.data} />
    </div>
  );
}

