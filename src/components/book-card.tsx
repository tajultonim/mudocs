import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";

export default function BookCard({
  title,
  author,
  image,
  slug,
}: {
  title: string;
  author: string;
  image: string;
  slug: string;
}) {
  return (
    <Link href={slug}>
      <Card className=" p-0">
        <CardContent className="px-0 py-0 pb-2">
          <Image
            className="rounded-t-xl w-full aspect-[63/94] object-cover"
            src={image}
            alt={title}
            width={(300 * 63) / 94}
            height={300}
            quality={1}
          />
          <p className=" pl-2 mt-2 line-clamp-1">{title}</p>
          <p className=" pl-2 text-sm text-gray-400 line-clamp-1">{author}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
