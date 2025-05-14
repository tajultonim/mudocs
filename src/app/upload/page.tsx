"use client"

import dynamic from 'next/dynamic'
 
const DynamicComponentWithNoSSR = dynamic(
  () => import('./upload-form'),
  { ssr: false }
)

// import UploadForm from "@/app/upload/upload-form";
import supabase from "@/lib/supabase";
// import React, { ChangeEvent, useState } from "react";

export default async function UploadPage() {

  const authorQuery = supabase.from("authors").select("*");
  const tagsQuery = supabase.from("tags").select("*");
  const [authors, tags] = await Promise.all([authorQuery, tagsQuery]);
  if (authors.error||tags.error) {
    console.error("Error fetching authors or tags:", authors.error || tags.error);
    return <div>Error fetching data</div>;
  }

  return (
    <div className="w-full flex justify-center">
      <DynamicComponentWithNoSSR tags={tags.data} authors={authors.data} />
    </div>
  );
}
