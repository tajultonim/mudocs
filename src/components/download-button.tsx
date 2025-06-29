"use client";

import { useState } from "react";
import { createDownload } from "@/app/actions/file-action";
import { revalidateSSGPath } from "@/app/actions/revalidation";
import { MdFileDownload } from "react-icons/md";

export default function DownloadButton({
  file_id,
  file_title,
  className,
}: {
  file_id: string;
  file_title?: string;
  className?: string;
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
        className={`cursor-pointer items-center flex bg-blue-700 rounded-sm p-1 px-2 text-white disabled:bg-gray-600 ${className}`}
        disabled={isloading}
      >
        <MdFileDownload className="mr-1" />
        {isloading ? "Loading..." : "Download File"}
      </button>
    </>
  );
}
