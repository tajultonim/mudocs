"use client";

import {  useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

export default function TagsInput({
  title,
  tags,
  onChange,
  onNewTag,
  allowNewTag,
  placeholder,
}: {
  title: string;
  tags: { name: string; id: string }[];
  onChange: (e: { value: string[]; entry: string }) => void;
  onNewTag?: (tag: string) => boolean | Promise<boolean>;
  allowNewTag?: boolean;
  placeholder?: string;
}) {
  const [alltags, setAlltags] = useState<string[]>(tags.map((tag) => tag.name));
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const tagOptions = new Set(alltags.filter((tag) => !selectedTags.has(tag)));

  const fireChange = (val: string) => {
    onChange({
        entry: val,
        value: Array.from(selectedTags.values()).map((tagname) => {
        const tag = tags.find((tag) => tag.name === tagname);
         return tag ? tag.id : tagname.trim().replace(/\s+/g, "-");
      }),
    });
  };

  return (
    <>
      <p>{title}</p>
      <div className=" max-w-md overflow-x-scroll bg-gray-700 -mt-3 rounded-md px-2 py-1 w-full  flex">
        <div className=" flex">
          {Array.from(selectedTags.values()).map((tag) => (
            <div
              key={tag}
              className="flex whitespace-nowrap bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold text-gray-700 mr-2"
            >
              {tag}
              <button
                className="ml-1 rounded-full cursor-pointer hover:bg-gray-500 hover:text-white"
                onClick={() => {
                  setSelectedTags((prev) => {
                    const up = new Set(prev);
                    up.delete(tag);
                    return up;
                  });
                  fireChange("");
                }}
              >
                <IoCloseOutline />
              </button>
            </div>
          ))}
        </div>
        <input
          className=" outline-0 w-full min-w-sm"
          list={title.trim().replace(/\s+/g, "-").toLowerCase()}
          placeholder={placeholder || "Enter anther value..."}
          enterKeyHint="next"
          onKeyDown={async (e) => {
            const target = e.target as HTMLInputElement;
            const val = target.value
              .toLowerCase()
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
            if (e.key == "Enter" && val.length) {
              if (!allowNewTag && !tagOptions.has(val)) {
                return;
              } else if (allowNewTag && !tagOptions.has(val)) {
                const isconfirmed = confirm(
                  `Are you sure you want to add "${val}" as a new option?`
                );
                if (!isconfirmed) {
                  return;
                } else {
                  const success = await onNewTag?.(val);
                  setAlltags((prev) => [...prev, val]);
                  if (!success) {
                    return;
                  }
                }
              }
              setSelectedTags((prev) => {
                const up = new Set(prev.add(val));
                target.value = "";
                return up;
              });
              fireChange(val);
            }
          }}
        />
        <datalist id={title.trim().replace(/\s+/g, "-").toLowerCase()}>
          {Array.from(tagOptions.values()).map((tag) => (
            <option key={tag} value={tag} />
          ))}
        </datalist>
      </div>
    </>
  );
}


