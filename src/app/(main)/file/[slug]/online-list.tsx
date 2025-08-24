"use client";

import { deleteFile } from "@/app/actions/file-action";
import { useAlert } from "@/components/alerts";
import DownloadButton from "@/components/download-button";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/authprovider";
import {
  Download,
  Ellipsis,
  List,
  LucideIcon,
  Pencil,
  Trash2,
  Unlink,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Divider } from "@/components/divider";

export default function OnlineList({
  files,
}: {
  files:
    | {
        id: string;
        title: string;
        mime_type: string;
        size_bytes: number;
        pages: number | null;
        publisher: {
          name: string;
          slug: string;
        } | null;
        year: string | null;
        uploader: {
          id: string;
        } | null;
      }[]
    | [];
}) {
  const { user } = useAuth();

  if (!user) {
    return <></>;
  }
  return (
    <>
      <Link className="group" href={`/explore/e-lib/`}>
        <h2 className="text-lg font-semibold mt-4">
          E-Library
          <LinkIcon
            size={16}
            className="inline-block ml-1 group-hover:text-slate-500"
          />
        </h2>
      </Link>
      <Divider />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Format</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Pages</TableHead>
            <TableHead>Publisher</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file, index) => (
            <TableRow key={file.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{file.title}</TableCell>
              <TableCell>
                {file.mime_type == "application/pdf" ? "pdf" : "unknown"}
              </TableCell>
              <TableCell>
                {(file.size_bytes / (1024 * 1024)).toFixed(2)} MB
              </TableCell>
              <TableCell>{file.pages || "-"}</TableCell>
              <TableCell>
                <Link
                  className="hover:underline"
                  href={`/publisher/${file.publisher?.slug}`}
                >
                  {file.publisher?.name || "-"}
                </Link>
              </TableCell>
              <TableCell>{file.year || "-"}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Ellipsis />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className=" cursor-pointer">
                      <Download />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className=" cursor-pointer">
                      <Unlink />
                      Report
                    </DropdownMenuItem>
                    {user.roles.includes("admin") && (
                      <>
                        <DropdownMenuItem className=" cursor-pointer">
                          <Pencil />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 cursor-pointer">
                          <Trash2 className="text-red-500" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export function IconLabel({
  Icon,
  children,
  className,
}: {
  Icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <Icon size={18} className="h-6" />
      <div>{children}</div>
    </div>
  );
}
