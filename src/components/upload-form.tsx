"use client";

import { Database } from "../lib/database";
import { useState } from "react";
import dynamic from "next/dynamic";
import TagsInput from "./tags-input";
import * as authoractions from "../app/actions/author-action";
import * as fileactions from "../app/actions/file-action";

const FileInput = dynamic(() => import("./file-upload-input"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
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

  const disabled =
    !file || !fileName || !category || isloading || !authors.length;

  async function handleFileUpload() {
    try {
      if (!file || !cover || !hash) {
        return;
      }
      setIsloading(true);
      const [FileSASUrl, CoverSASUrl] = await Promise.all([
        fileactions.getSasUrl(hash, "document-files"),
        fileactions.getSasUrl(hash, "file-covers"),
      ]);

      const coverFile = await dataUrlToBlob(cover);

      const [FileRes, CoverRes] = await Promise.all([
        fetch(FileSASUrl, {
          method: "PUT",
          headers: {
            "x-ms-blob-type": "BlockBlob",
            "Content-Type": file.type,
          },
          body: file,
        }),
        fetch(CoverSASUrl, {
          method: "PUT",
          headers: {
            "x-ms-blob-type": "BlockBlob",
            "Content-Type": coverFile.type,
          },
          body: coverFile,
        }),
      ]);

      if (FileRes.ok && CoverRes.ok) {
        const res = await fileactions.create({
          title: fileName,
          file_path: "document-files/" + hash,
          sha256_hash: hash,
          mime_type: file.type,
          size_bytes: file.size,
          type: "file",
          category: category,
          tags: selectedTags,
          authors: selectedAuthors,
          description: description,
          isbn: isbn,
          doi: doi,
          cover_path: "file-covers/" + hash,
        });
        setIsloading(false);
        if (res.status === "success") {
          alert("File uploaded successfully!");
          // Reset form
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
        } else {
          alert("Error uploading file: " + res.message);
        }
      } else {
        alert("Error uploading file to Azure Blob Storage.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  }

  return (
    <>
      <div className="upload-page flex flex-col justify-center">
        <div className=" font-semibold text-lg mb-2">Upload File </div>
        <div className="w-full flex justify-center">
          <FileInput
            onFileDrop={(data) => {
              setFile(data.file);
              setCover(data.cover);
              setHash(data.hash);
            }}
          />
        </div>
        <div className="flex flex-col gap-4 mt-4 mb-4">
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
              placeholder="Enter author name..."
              onNewTag={async (name: string) => {
                alert("ok");
                const res = await authoractions.create(name);
                return res?.status == "success";
              }}
              onChange={(e) => {
                console.log(e);
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
            placeholder="Enter tag..."
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
          ) : (
            <></>
          )}
          <button
            disabled={disabled || isloading}
            onClick={async () => {
              await handleFileUpload();
            }}
            className="bg-gray-700 py-1 cursor-pointer hover:bg-gray-600 disabled:bg-gray-500 rounded-md text-white"
          >
            {isloading ? "Loading..." : "Upload"}
          </button>
        </div>
      </div>
    </>
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
        className="bg-gray-700 rounded-md px-2 py-1 w-full"
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
      <input
        className="bg-gray-700 rounded-md px-2 py-1 w-full"
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
