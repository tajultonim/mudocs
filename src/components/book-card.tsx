import Image from "next/image";
import Link from "next/link";

export default function BookCard({
  title,
  author,
  image,
  slug
}: {
  title: string;
  author: string;
  image: string;
  slug:string;
}) {
  return (
    <Link href={slug}>
      <div className=" cursor-pointer">
        <Image
          className="rounded-lg w-full aspect-[63/94]"
          src={image}
          alt={title}
          width={300*63/94}
          height={300}
          quality={1}
        />
        <p className=" mt-2 line-clamp-1">{title}</p>
        <p className="text-sm text-gray-400 line-clamp-1">{author}</p>
      </div>
    </Link>
  );
}
