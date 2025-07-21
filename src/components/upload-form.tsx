"use client";

import { Database } from "../lib/database";
import { useState } from "react";
import dynamic from "next/dynamic";
import TagsInput from "./tags-input";
import * as authoractions from "../app/actions/author-action";
import * as fileactions from "../app/actions/file-action";
import { BlockBlobClient } from "@azure/storage-blob";
import { revalidateSSGPath } from "@/app/actions/revalidation";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const FileInput = dynamic(() => import("./file-upload-input"), {
  ssr: false,
  loading: () => (
    <Skeleton className=" w-[256px] h-[384px] border-2 border-gray-300 border-dashed rounded-lg flex justify-center items-center">
      <p className="mb-2 font-semibold text-sm text-gray-500 dark:text-gray-400">
        Loading...
      </p>
    </Skeleton>
  ),
});

export default function UploadForm({
  tags,
  authors,
}: {
  tags: Database["public"]["Tables"]["tags"]["Row"][];
  authors: Database["public"]["Tables"]["authors"]["Row"][];
}) {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>("");
  const [cover, setCover] = useState<string>("");
  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [doi, setDoi] = useState("");
  const [isbn, setIsbn] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [percentage, setPercentage] = useState(0);

  const disabled =
    !file || !fileName || !category || isloading || !selectedAuthors.length;

  async function handleFileUpload() {
    try {
      if (!file || !cover || !hash) {
        return;
      }
      setIsloading(true);

      const [FileSASUrl, CoverSASUrl] = await Promise.all([
        fileactions.getSasUrl(`document-files/${hash}.pdf`),
        fileactions.getSasUrl(`file-covers/${hash}.png`),
      ]);

      const coverFile = await dataUrlToBlob(cover);

      const fileBlockBlobClient = new BlockBlobClient(FileSASUrl as string);
      const coverBlockBlobClient = new BlockBlobClient(CoverSASUrl as string);
      await Promise.all([
        fileBlockBlobClient.uploadBrowserData(file, {
          onProgress: (progress) => {
            const percent = (progress.loadedBytes / file.size) * 100;
            setPercentage(percent);
            console.log(`Upload progress: ${percent.toFixed(2)}%`);
          },
        }),
        coverBlockBlobClient.uploadBrowserData(coverFile, {
          onProgress: (progress) => {
            const percent = (progress.loadedBytes / coverFile.size) * 100;
            console.log(`Upload progress: ${percent.toFixed(2)}%`);
          },
        }),
      ]);

      const res = await fileactions.create({
        title: fileName,
        file_path: "document-files/" + hash+".pdf",
        sha256_hash: hash,
        mime_type: file.type,
        size_bytes: file.size,
        type: category,
        tags: selectedTags,
        authors: selectedAuthors,
        description: description,
        isbn: isbn,
        doi: doi,
        cover_path: "file-covers/" + hash+".png",
      });
      if (res.status === "success") {
        setFile(null);
        setCover("");
        setHash("");
        setFileName("");
        setDescription("");
        setCategory("");
        setSelectedAuthors([]);
        setSelectedTags([]);
        setDoi("");
        setIsbn("");
        await Promise.all([
          revalidateSSGPath(`/file/${res.data}`),
          revalidateSSGPath("/"),
        ]);
        alert("File uploaded successfully!");
        cleanStates();
      } else {
        console.log("errorrr", res);
        alert("Error uploading file: " + res.message);
      }
    } catch (error) {
      const e = error as { code?: string; message?: string };
      if (e["code"] == "UnauthorizedBlobOverwrite") {
        alert("File already exists in our server.\n hash: " + hash);
        console.log("File already exists\n hash: " + hash);
      } else if (error instanceof Error) {
        console.error("Error message:", error.message);
        alert("Error uploading file: " + error.message);
      } else {
        console.error("Unexpected error:", error);
        alert("Error uploading file: " + error);
      }
    } finally {
      setIsloading(false);
    }
  }

  function cleanStates(){
    setFile(null);
    setCover("");
    setHash("");
    setFileName("");
    setDescription("");
    setCategory("");
    setSelectedAuthors([]);
    setSelectedTags([]);
    setDoi("");
    setIsbn("");
  }

  return (
    <div className="p-8 py-2 rounded flex flex-col md:flex-row gap-2 sm:gap-8 items-center">
      <div className="flex flex-col items-center w-full sm:w-[40%] md:w-auto">
        <FileInput
          onFileDrop={(data) => {
            setFile(data.file);
            setCover(data.cover);
            setHash(data.hash);
          }}
        />
      </div>
      {/* Form (right) */}
      <div className="flex-1 w-full sm:w-[60%] flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2 text-white">Upload File</h1>
        <InputField
          title="File Name"
          type="text"
          placeholder="Enter file name"
          onChange={(e) => {
            setFileName(e.target.value);
          }}
        />
        <InputField
          title="Description"
          type="text"
          placeholder="Enter description"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <SelectInput
          title="Category"
          onChange={(e) => setCategory(e.target.value)}
          options={[
            { name: "Book", value: "book" },
            { name: "Paper", value: "paper" },
            { name: "Note", value: "note" },
            { name: "Other", value: "other" },
          ]}
          placeholder="Choose a category"
        />
        {category === "note" || category == "other" ? (
          <InputField
            title="Author"
            type="text"
            placeholder="self"
            initvalue="self"
            onChange={() => {
              setSelectedAuthors(["self"]);
            }}
            disabled
          />
        ) : (
          <TagsInput
            title="Authors (maintain order)"
            tags={authors}
            allowNewTag
            isOrdered
            onNewTag={async (name: string) => {
              const res = await authoractions.create(name);
              return {
                status: res?.status || "error",
                data: res?.data,
              };
            }}
            onChange={(e) => {
              setSelectedAuthors(e.value);
            }}
          />
        )}
        <TagsInput
          title="Tags"
          tags={tags}
          onChange={(e) => {
            setSelectedTags(e.value);
          }}
        />
        {category === "book" ? (
          <InputField
            title="ISBN (optional)"
            type="text"
            placeholder="Enter ISBN"
            onChange={(e) => {
              setIsbn(e.target.value);
            }}
          />
        ) : category === "paper" ? (
          <InputField
            title="DOI (optional)"
            type="text"
            placeholder="Enter DOI"
            onChange={(e) => {
              setDoi(e.target.value);
            }}
          />
        ) : null}
        <Button
          disabled={disabled || isloading}
          onClick={async () => {
            await handleFileUpload();
          }}
        >
          {isloading ? `${percentage}% uploaded...` : "Upload"}
        </Button>
      </div>
    </div>
  );
}

function SelectInput({
  title,
  options,
  placeholder,
  onChange,
}: {
  title: string;
  options: { name: string; value: string }[];
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="">
      <p>{title}</p>
      <select
        className="rounded-md leading-8 border px-2 py-1 w-full"
        onChange={onChange}
        defaultValue={""}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function InputField({
  title,
  type,
  placeholder,
  disabled,
  initvalue,
  onChange,
}: {
  title: string;
  type: string;
  placeholder: string;
  disabled?: boolean;
  initvalue?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="">
      <p>{title}</p>
      <Input
        className=""
        type={type}
        placeholder={placeholder}
        defaultValue={initvalue || ""}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

async function dataUrlToBlob(dataURL: string): Promise<Blob> {
  const res = await fetch(dataURL);
  const blob = await res.blob();
  return blob;
}
