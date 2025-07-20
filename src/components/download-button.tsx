"use client";

import { useState } from "react";
import { createDownload } from "@/app/actions/file-action";
import { revalidateSSGPath } from "@/app/actions/revalidation";
import {Button} from "@/components/ui/button";
import { Download, Loader2Icon } from "lucide-react";

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
      <Button
        onClick={handleDownload}
        variant={"default"}
        className={className}
        disabled={isloading}
      >
        {isloading?<Loader2Icon className="animate-spin mr-1"/>:<Download className="mr-1" />}
        {isloading ? "Loading..." : "Download"}
      </Button>
    </>
  );
}
