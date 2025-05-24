"use client";

import Dropzone from "react-dropzone";
import Image from "next/image";
import { useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

export default function FileInput({
  onFileDrop,
}: {
  onFileDrop: ({
    file,
    cover,
    hash,
  }: {
    file: File;
    cover: string;
    hash: string;
  }) => void;
}) {
  const [coverUrl, setCoverUrl] = useState<string>("");
  async function handleFileDrop(file: File) {
    const url = await extractCoverImage(file);
    setCoverUrl(url);
    const hash = await generateSHA256(file);
    onFileDrop({ file, cover: url, hash });
  }
  return (
    <Dropzone
      accept={{ "application/pdf": [".pdf"] }}
      multiple={false}
      onDrop={(acceptedFiles) => {
        if (acceptedFiles.length === 0) return;
        handleFileDrop(acceptedFiles[0]);
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <>
          <div className="w-full max-w-lg min-w-md flex flex-col justify-center items-center">
            <div className="" {...getRootProps()}>
              <label className="flex flex-col items-center justify-center aspect-[2/3] w-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <Image
                  src={coverUrl || "/images/loading.gif"}
                  alt="test"
                  width={200}
                  height={300}
                  className={`w-full ${coverUrl ? "" : "hidden"}`}
                />
                <div
                  className={`${
                    coverUrl ? "hidden" : "flex"
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
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Only PDF files are currently supported.
                  </p>
                </div>
              </label>
              <input accept="application/pdf" {...getInputProps()} />
            </div>
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

const generateSHA256 = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};
