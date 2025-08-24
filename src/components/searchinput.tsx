"use client";

import { ResultType, searchWithQuery } from "@/app/actions/search-action";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";


export default function SearchInput() {
  const [query, setQuery] = useState<string>("");
  const [searchresults, setSearchresults] = useState<ResultType[] | null>(
    null
  );
  const [isFocused, setIsFocused] = useState(false);
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim().length > 3) {
      const response = await searchWithQuery(query);
      if (response.status === "success") {
        setSearchresults(response.results as unknown as ResultType[]);
      } else {
        console.error(response.message);
        alert(response.message);
      }
    }
  };
  return (
    <div className=" relative">
      <div className="flex border mx-6 max-w-xs sm:max-w-lg items-center gap-2 rounded-lg pl-2">
        <Search />
        <Input
          value={query}
          enterKeyHint="next"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className=" outline-0 border-0 border-l shadow-none rounded-lg rounded-l-none "
          placeholder="Search..."
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
      </div>
      <div
        className={`absolute max-w-xs overflow-x-hidden group ${
          isFocused ? "" : "hidden"
        } top-10 bg-white border border-t-0 p-1 rounded-b-lg shadow-lg  `}
      >
        {searchresults?.map((res) => (
          <SearchResult key={res.id} data={res} />
        ))}
      </div>
    </div>
  );
}

function SearchResult({ data }: { data: ResultType }) {
  return (
    <Link
      href={`/file/${data.id}`}
      className="[&>*]:border-b last:[&>*]:border-0 w-full"
    >
      <div className="w-full border-gray-500 p-2 ">
        <div className="flex min-w-sm sm:min-w-xl w-full gap-2 items-center">
          <div className=" ">
            <Image
              alt={data.title}
              src={`/remote/${data.cover_path}`}
              width={(60 * 63) / 94}
              height={60}
            />
          </div>
          <div className="">
            <p className=" line-clamp-1">{data.title}</p>
            <p className=" text-sm text-gray-400 line-clamp-1">
              {data.authors
                .map((author) => author.entry.name)
                .join(", ")}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
