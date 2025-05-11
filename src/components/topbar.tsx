import Link from "next/link";
import { MdArrowRight } from "react-icons/md";

const tags = [
  { name: "All", slug: "" },
  { name: "Books", slug: "books" },
  { name: "Papers", slug: "papers" },
  { name: "Notes", slug: "notes" },
];
export default function TopBar() {
  return (
    <div className=" w-full flex justify-between mb-4">
      <div className="flex gap-2">
        {tags.map((tag) => (
          <Tag key={tag.slug} name={tag.name} slug={tag.slug} active={tag.slug==""} />
        ))}
      </div>
      <div className="">
        <button className=" items-center cursor-pointer flex text-white rounded-lg">
          <p>Next</p>
          <MdArrowRight size={28} />
        </button>
      </div>
    </div>
  );
}

function Tag({
  name,
  slug,
  active,
}: {
  name: string;
  slug: string;
  active: boolean;
}) {
  return (
    <Link href={slug == "" ? "/" : `/?tab=${slug}`}>
      <div
        className={`${
          active ? "bg-white text-gray-800 " : "bg-gray-800 text-white hover:bg-gray-900"
        } px-2 py-1 rounded-2xl cursor-pointer`}
      >
        <p className=" text-sm">{name}</p>
      </div>
    </Link>
  );
}
