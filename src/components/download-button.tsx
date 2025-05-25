"use client";

import { useState } from "react";
import { createDownload } from "@/app/actions/file-action";
import { revalidateSSGPath } from "@/app/actions/revalidation";

export default function DownloadButton({
  file_id,
  file_title,
}: {
  file_id: string;
  file_title?: string;
}) {
  const [isloading, setIsloading] = useState(false);
  async function handleDownload() {
    if (!file_id) {
      return;
    }
    setIsloading(true);
    const urlRes = await createDownload(file_id, "");
    const link = document.createElement("a");
    link.href = urlRes.data || "";
    link.download = file_title || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    revalidateSSGPath("/file/" + file_id);
    setIsloading(false);
  }
  return (
    <>
      <button
        onClick={handleDownload}
        className=" cursor-pointer text-blue-500 disabled:text-blue-200"
        disabled={isloading}
      >
        {isloading ? "Loading..." : "Download File"}
      </button>
    </>
  );
}
