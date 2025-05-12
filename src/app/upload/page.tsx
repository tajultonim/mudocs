import UploadForm from "@/components/upload-form";
import supabase from "@/lib/supabase";
// import React, { ChangeEvent, useState } from "react";

export default async function UploadPage() {

  let authorQuery = supabase.from("authors").select("*");
  let tagsQuery = supabase.from("tags").select("*");
  let [authors, tags] = await Promise.all([authorQuery, tagsQuery]);
  if (authors.error||tags.error) {
    console.error("Error fetching authors or tags:", authors.error || tags.error);
    return <div>Error fetching data</div>;
  }

  function handleFileUpload(file: File) {
    // Handle file upload logic here
    console.log("File uploaded:", file.name);
  }

  return (
    <div className="w-full flex justify-center">
      <UploadForm tags={tags.data} authors={authors.data} />
    </div>
  );
}
