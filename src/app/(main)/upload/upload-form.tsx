"use client";

import { Database } from "@/lib/database";
import { useState } from "react";
import dynamic from "next/dynamic";
import TagsInput from "@/components/tags-input";
import * as authoractions from "@/app/actions/author-action";
import * as fileactions from "@/app/actions/file-action";
import * as tagactions from "@/app/actions/tag-action";
import * as publisheractions from "@/app/actions/publisher-action";
import { revalidateSSGPath } from "@/app/actions/revalidation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadFileWithManualProgress } from "./uploadwithprogress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAlert } from "@/components/alerts";

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
  publishers,
}: {
  tags: Database["public"]["Tables"]["tags"]["Row"][];
  authors: Database["public"]["Tables"]["authors"]["Row"][];
  publishers?: Database["public"]["Tables"]["publishers"]["Row"][];
}) {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>("");
  const [cover, setCover] = useState<string>("");
  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPublisher, setSelectedPublisher] = useState<string>("");
  const [doi, setDoi] = useState("");
  const [isbn, setIsbn] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [percentage, setPercentage] = useState({
    percent: 0,
    uploaded_bytes: 0,
    size_bytes: 0,
  });
  const [year, setYear] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const { showAlert, AlertComponent } = useAlert();

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

      const coverFile = getFileFromDataURL(cover);

      // const fileBlockBlobClient = new BlockBlobClient(FileSASUrl as string);
      // const coverBlockBlobClient = new BlockBlobClient(CoverSASUrl as string);
      // await Promise.all([
      //   fileBlockBlobClient.uploadBrowserData(file, {
      //     onProgress: (progress) => {
      //       const percent = (progress.loadedBytes / file.size) * 100;
      //       setPercentage(percent);
      //       console.log(`Upload progress: ${percent.toFixed(2)}%`);
      //     },
      //   }),
      //   coverBlockBlobClient.uploadBrowserData(coverFile, {
      //     onProgress: (progress) => {
      //       const percent = (progress.loadedBytes / coverFile.size) * 100;
      //       console.log(`Upload progress: ${percent.toFixed(2)}%`);
      //     },
      //   }),
      // ]);
      const res = await fileactions.createUpload({
        title: fileName,
        file_path: "document-files/" + hash + ".pdf",
        sha256_hash: hash,
        mime_type: file.type,
        size_bytes: file.size,
        type: category,
        tags: selectedTags,
        authors: selectedAuthors,
        description: description,
        isbn: isbn,
        doi: doi,
        publisher_id: selectedPublisher,
        year: year,
        cover_path: "file-covers/" + hash + ".png",
        language: language,
      });

      if (res.status === "success") {
        await Promise.all([
          uploadFileWithManualProgress({
            file,
            sasUrl: FileSASUrl as string,
            onProgress: (p) => {
              setPercentage(p);
            },
          }),
          uploadFileWithManualProgress({
            file: coverFile,
            sasUrl: CoverSASUrl as string,
            onProgress: (p) => {
              console.log(`Cover upload progress:`, p);
            },
          }),
        ]);
        await fileactions.uploadComplete(res.data || "");
        await Promise.all([
          revalidateSSGPath(`/file/${res.data}`),
          revalidateSSGPath("/"),
        ]);
        showAlert({
          message: "File uploaded successfully!",
          type: "success",
          title: "Upload Complete",
        });
        window.location.reload();
      } else {
        console.log("errorrr", res);
        showAlert({
          message: res.message,
          type: "error",
          title: "Upload Failed",
        });
      }
    } catch (error) {
      const e = error as { code?: string; message?: string };
      if (e["code"] == "UnauthorizedBlobOverwrite") {
        showAlert({
          message: "File already exists in our server.\n hash: " + hash,
          type: "error",
          title: "Upload Failed",
        });
        console.log("File already exists\n hash: " + hash);
      } else if (error instanceof Error) {
        console.error("Error message:", error.message);
        showAlert({
          message: "Error uploading file: " + error.message,
          type: "error",
          title: "Upload Failed",
        });
      } else {
        console.error("Unexpected error:", error);
        showAlert({
          message: "Error uploading file: " + error,
          type: "error",
          title: "Upload Failed",
        });
      }
    } finally {
      setIsloading(false);
    }
  }

  return (
    <>
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
            initvalue={fileName}
            onChange={(e) => {
              setFileName(e.target.value);
            }}
          />
          <InputField
            title="Description"
            type="text"
            initvalue={description}
            placeholder="Enter description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <SelectInput
            title="Category"
            onChange={(e) => {
              setCategory(e.value);
            }}
            options={[
              { label: "Book", value: "book" },
              { label: "Paper", value: "paper" },
              { label: "Note", value: "note" },
              { label: "Other", value: "other" },
            ]}
            required
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
          {category === "book" && (
            <SelectInput
              options={
                publishers?.map((p) => ({
                  label: p.name,
                  value: p.id,
                })) || []
              }
              title="Publisher"
              onNewTag={(value) => {
                return publisheractions.create(value).then((res) => {
                  setSelectedPublisher(res?.data?.id || "");
                  return {
                    status: res?.status || "error",
                    data: res?.data
                      ? { value: res.data.id, label: res.data.name }
                      : undefined,
                  };
                });
              }}
              onChange={(e) => setSelectedPublisher(e.value)}
            />
          )}
          <SelectInput
            options={Array.from({ length: 100 }, (_, i) => ({
              label: (new Date().getFullYear() - i).toString(),
              value: (new Date().getFullYear() - i).toString(),
            }))}
            title="Year"
            onNewTag={(value: string) => {
              if (
                parseInt(value) < 100 ||
                parseInt(value) > new Date().getFullYear()
              ) {
                return {
                  status: "error",
                  data: { value: value, label: value },
                };
              }
              return {
                status: "success",
                data: { value: value, label: value },
              };
            }}
            onChange={(e) => setYear(e.value)}
          />
          <SelectInput
            title="Language"
            options={[
              { label: "English", value: "en" },
              { label: "Bengali", value: "bn" },
            ]}
            onChange={(e) => setLanguage(e.value)}
          />
          <TagsInput
            title="Tags"
            tags={tags}
            allowNewTag
            onNewTag={async (name: string) => {
              const res = await tagactions.create(name);
              if (res?.status == "error") {
                alert(JSON.stringify(res));
              }
              return {
                status: res?.status || "error",
                data: res?.data,
              };
            }}
            onChange={(e) => {
              setSelectedTags(e.value);
            }}
          />
          {category === "book" ? (
            <InputField
              title="ISBN (optional)"
              type="text"
              initvalue={isbn}
              placeholder="Enter ISBN"
              onChange={(e) => {
                setIsbn(e.target.value);
              }}
            />
          ) : category === "paper" ? (
            <InputField
              title="DOI (optional)"
              type="text"
              initvalue={doi}
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
            {isloading
              ? `${percentage.percent}% uploaded (${
                  (percentage.uploaded_bytes / (1024 * 1024)).toFixed(2)
                }MB/${(percentage.size_bytes / (1024 * 1024)).toFixed(2)}MB)...`
              : "Upload"}
          </Button>
        </div>
      </div>
      <AlertComponent />
    </>
  );
}

function SelectInput({
  title,
  options,
  onChange,
  onNewTag,
  required = false,
}: {
  title: string;
  options: { label: string; value: string }[];
  required?: boolean;
  onChange: (e: { value: string }) => void;
  onNewTag?: (
    label: string
  ) =>
    | { status: string; data?: { value: string; label: string } }
    | Promise<{ status: string; data?: { value: string; label: string } }>;
}) {
  const [selectableOptions, setSelectableOptions] = useState(options);
  const handleNewOption = async (label: string) => {
    if (!onNewTag) {
      return;
    }
    const newOptionRes = await onNewTag(label);
    if (!newOptionRes.data || newOptionRes.status !== "success") {
      return onChange({ value: "" });
    }
    setSelectableOptions((prev) => [
      ...prev,
      {
        value: newOptionRes.data?.value || "",
        label: newOptionRes.data?.label || "",
      },
    ]);
    onChange({ value: newOptionRes.data.value });
  };
  return (
    <>
      <p>{title}</p>
      <div className="-mt-4">
        <ComboBox
          required={required}
          options={selectableOptions}
          onChange={({ value, label, isNew }) => {
            if (!isNew) {
              const stag = options.find((option) => option.value === value);
              if (stag || value === "") {
                onChange({ value: stag?.value || "" });
              }
            } else if (isNew && label) {
              handleNewOption(label);
            }
          }}
          allowNewTag={typeof onNewTag !== "undefined"}
        />
      </div>
    </>
  );
}

function ComboBox({
  options,
  onChange,
  allowNewTag = false,
  required = false,
}: {
  options: {
    value: string;
    label: string;
  }[];
  required?: boolean;
  onChange: ({
    value,
    label,
    isNew,
  }: {
    value?: string;
    label?: string;
    isNew?: boolean;
  }) => void;
  allowNewTag?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {isNew
            ? currentValue
            : currentValue
            ? options.find((option) => option.value === currentValue)?.label
            : "Select..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {allowNewTag && (
            <CommandInput
              onValueChange={(search) => {
                setIsNew(false);
                setCurrentValue(search);
              }}
              placeholder="Search..."
              className="h-9"
            />
          )}
          <CommandList>
            <CommandEmpty>
              No entry found
              {allowNewTag && currentValue?.toLocaleLowerCase().trim() ? (
                <>
                  <br />
                  <Button
                    onClick={() => {
                      setIsNew(true);
                      onChange({ label: currentValue, isNew: true });
                      setOpen(false);
                    }}
                    variant={"secondary"}
                    size={"sm"}
                    className=" py-0 mt-1 px-2"
                  >
                    +Add
                  </Button>
                </>
              ) : (
                <></>
              )}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(v) => {
                    if (required && v === currentValue) {
                      return;
                    }
                    setCurrentValue(v === currentValue ? "" : v);
                    setIsNew(false);
                    onChange({
                      value: v === currentValue ? "" : v,
                      label: option.label,
                      isNew: false,
                    });
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      currentValue === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
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
        value={initvalue || ""}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

export function getFileFromDataURL(dataURL: string): File {
  const arr = dataURL.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], "", { type: mime });
}
