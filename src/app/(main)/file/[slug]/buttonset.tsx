"use client";

import { deleteFile } from "@/app/actions/file-action";
import { useAlert } from "@/components/alerts";
import DownloadButton from "@/components/download-button";
// import { LoginPopup } from "@/components/login-alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/authprovider";
import { Pencil, Trash2 } from "lucide-react";
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
          <DeleteButton id={id} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

function DeleteButton({ id }: { id: string }) {
  const { AlertComponent, showAlert } = useAlert();
  async function handleDelete() {
    const confirmed = confirm("Are you sure you want to delete this file?");
    if (!confirmed) return;
    const res = await deleteFile(id);
    showAlert({
      title: res.status === "success" ? "Success" : "Error",
      message: res.message,
      type: res.status === "success" ? "success" : "error",
    });
    window.location.href = "/";
  }
  return (
    <>
      <Button variant="destructive" onClick={handleDelete}>
        <Trash2 className="mr-1" />
        Delete
      </Button>
      <AlertComponent />
    </>
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
