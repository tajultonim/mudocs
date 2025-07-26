import UploadForm from "./upload-form";
import supabase from "@/lib/supabase";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "μDocs - Upload",
};
export default async function UploadPage() {
  const authorQuery = supabase.from("authors").select("*");
  const tagsQuery = supabase.from("tags").select("*");
  const publisherQuery = supabase.from("publishers").select("*");
  const [authors, tags, publishers] = await Promise.all([authorQuery, tagsQuery, publisherQuery]);
  if (authors.error || tags.error || publishers.error) {
    console.error(
      "Error fetching authors or tags:",
      authors.error || tags.error
    );
    return <div>Error fetching data</div>;
  }

  return (
    <div className=" max-w-3xl">
      <UploadForm tags={tags.data} authors={authors.data} publishers={publishers.data} />
    </div>
  );
}

