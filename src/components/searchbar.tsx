"use client";

import { searchWithQuery } from "@/app/actions/search-action";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";

interface SearchResultType {
  id: string;
  title: string;
  cover_path: string | null;
  file_authors: {
    authors: {
      name: string;
    };
    order: number;
  }[];
  type: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState<string>("");
  const [searchresults, setSearchresults] = useState<SearchResultType[] | null>(
    null
  );
  const [isFocused, setIsFocused] = useState(false);
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim().length > 3) {
      const response = await searchWithQuery(query);
      if (response.status === "success") {
        setSearchresults(response.results as unknown as SearchResultType[]);
      } else {
        console.error(response.message);
        alert(response.message);
      }
    }
  };
  return (
    <div className=" relative ">
      <div className="flex max-w-xs items-center gap-2 bg-gray-800 rounded-lg px-2 py-1">
        <IoSearch />
        <input
          value={query}
          enterKeyHint="next"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className=" outline-0"
          placeholder="Search..."
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
      </div>
      <div
        className={`absolute group ${
          isFocused ? "" : "hidden"
        } top-10 bg-gray-800 `}
      >
        {searchresults?.map((res) => (
          <SearchResult key={res.id} data={res} />
        ))}
      </div>
    </div>
  );
}

function SearchResult({ data }: { data: SearchResultType }) {
  return (
    <Link
      href={`/file/${data.id}`}
      className="[&>*]:border-b last:[&>*]:border-0"
    >
      <div className="w-full border-gray-500 p-2 ">
        <div className="flex min-w-sm w-full gap-2 items-center">
          <div className=" ">
            <Image
              alt={data.title}
              src={`https://mudocsstorage.blob.core.windows.net/${data.cover_path}`}
              width={(60 * 63) / 94}
              height={60}
            />
          </div>
          <div className="">
            <p className=" line-clamp-1">{data.title}</p>
            <p className=" text-sm text-gray-400 line-clamp-1">
              {data.file_authors
                .map((author) => author.authors.name)
                .join(", ")}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
