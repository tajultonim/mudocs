"use client";
import { Database } from "../lib/database";
import { useState, ChangeEvent, useCallback } from "react";
import Dropzone from "react-dropzone";
import Image from "next/image";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

export default function UpgadForm({
  tags,
  authors,
}: {
  tags: Database["public"]["Tables"]["tags"]["Row"][];
  authors: Database["public"]["Tables"]["authors"]["Row"][];
}) {
  const [category, setCategory] = useState("");

  function handleFileUpload(file: File) {}
  return (
    <>
      <div className="upload-page flex flex-col justify-center">
        <div className=" font-semibold text-lg mb-2">Upload File </div>
        <div className="w-full flex justify-center">
          <FileInput onFileDrop={handleFileUpload} />
        </div>
        <div className="flex flex-col gap-4 mt-4 mb-4">
          <InputField
            title="File Name"
            type="text"
            placeholder="Enter file name"
          />
          <InputField
            title="Description"
            type="text"
            placeholder="Enter description"
          />
          <SelectInput
            title="Category"
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { name: "Book", value: "book" },
              { name: "Paper", value: "paper" },
              { name: "Note", value: "note" },
            ]}
            placeholder="Choose a category"
          />
          <SelectInput
            title="Author"
            onChange={() => {}}
            options={authors.map((author) => ({
              name: author.name,
              value: author.id,
            }))}
            placeholder="Choose an author"
          />
          {category === "book" ? (
            <InputField title="ISBN (optional)" type="text" placeholder="Enter ISBN" />
          ) : category === "paper" ? (
            <InputField title="DOI (optional)" type="text" placeholder="Enter DOI" />
          ) : (
            <></>
          )}
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
}: {
  title: string;
  type: string;
  placeholder: string;
}) {
  const [value, setValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return (
    <div className="">
      <p>{title}</p>
      <input
        className="bg-gray-700 rounded-md px-2 py-1 w-full"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

function FileInput({ onFileDrop }: { onFileDrop: (file: File) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string>("");

  function handleFileDrop(file: File) {
    extractCoverImage(file).then((url) => {
      setCoverUrl(url);
    });
  }
  return (
    <Dropzone
      accept={{ "application/pdf": [".pdf"] }}
      multiple={false}
      onDrop={(acceptedFiles) => {
        if(acceptedFiles.length === 0) return;
        setFile(acceptedFiles[0]);
        onFileDrop(acceptedFiles[0]);
        handleFileDrop(acceptedFiles[0]);
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <>
          <div
            className="w-full max-w-lg min-w-md flex flex-col justify-center items-center"
            {...getRootProps()}
          >
            <label className="flex flex-col items-center justify-center aspect-[2/3] w-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <Image
                src={coverUrl || "https://picsum.photos/200/300"}
                alt="test"
                width={200}
                height={300}
                className={`w-full ${file ? "" : "hidden"}`}
              />
              <div
                className={`${
                  file ? "hidden" : "flex"
                } flex-col items-center justify-center pt-5 pb-6`}
              >
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Only PDF files are currently supported.
                </p>
              </div>
            </label>
            <input accept="application/pdf" {...getInputProps()} />
          </div>
        </>
      )}
    </Dropzone>
  );
}

const extractCoverImage = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport }).promise;
  return canvas.toDataURL("image/png");
};
