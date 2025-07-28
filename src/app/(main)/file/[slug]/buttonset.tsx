"use client";

import DownloadButton from "@/components/download-button";
import { LoginPopup } from "@/components/login-alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/authprovider";
import { Download, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export default function ButtonSet({
  id,
  title,
  uploader_id,
}: {
  id: string;
  title: string;
  uploader_id: string;
}) {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <DownloadButton file_id={id} file_title={title} />
      ) : (
       <> 
       {/* <LoginPopup
          title="Login Required"
          description="Please login to download files and enjoy other features"
        >
          <Button variant={"default"}>
            <Download className="mr-1" />
            Download
          </Button>
        </LoginPopup> */}
        </>
      )}
      {user?.id == uploader_id || user?.roles.includes("admin") ? (
        <>
          <EditButton id={id} />
          <DeleteButton />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

function DeleteButton() {
  return (
    <Button variant="destructive">
      <Trash2 className="mr-1" />
      Delete
    </Button>
  );
}

function EditButton({ id }: { id: string }) {
  return (
    <Button variant="secondary" asChild>
      <Link href={`/file/${id}/edit`}>
        <Pencil className="mr-1" />
        Edit
      </Link>
    </Button>
  );
}
