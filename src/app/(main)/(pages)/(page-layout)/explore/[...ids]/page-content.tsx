"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import BookCard from "@/components/book-card";
import { useEffect, useState } from "react";
import { getFilesByCategoryTypeByRange } from "@/app/actions/file-action";
import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
// import { categoryName, collectionName } from "./page";

type Query = Awaited<ReturnType<typeof getFilesByCategoryTypeByRange>>;

const collectionName = {
  bookmarks: "Bookmarks",
  "s-lib": "Seminar Library",
  "e-lib": "E Library",
  collection: "All",
};

const categoryName = {
  book: "Books",
  paper: "Papers",
  note: "Notes",
  other: "Documents",
};

export function PageContent({
  initialQuery,
  categoryId,
  collectionId,
}: {
  initialQuery: Query;
  categoryId?: string;
  collectionId?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const pageNumber = parseInt(searchParams.get("p") || "1");
  const numberOfPages = Math.ceil(query.count / 18);

  useEffect(() => {
    const fetchData = async () => {
      if (pageNumber == 1) {
        setQuery(initialQuery);
        setLoading(false);
        return;
      }
      setLoading(true);
      const fileQuery = await getFilesByCategoryTypeByRange({
        category: collectionId,
        type: categoryId,
        from: (pageNumber - 1) * 18,
        to: (pageNumber - 1) * 18 + 17,
      });
      setQuery(fileQuery);
      setLoading(false);
    };
    fetchData();
  }, [pageNumber, categoryId, collectionId, initialQuery]);
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {categoryId ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/explore/${collectionId}`}>
                    {collectionName[collectionId as "bookmarks"] || ""}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {categoryName[categoryId as "book"] || ""}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : collectionId ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {collectionName[collectionId as "bookmarks"] || ""}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : null}
        </BreadcrumbList>
      </Breadcrumb>
      <CardGrid
        numberOfPages={numberOfPages}
        pageNumber={pageNumber}
        query={query}
        loading={loading}
        title={
          categoryId
            ? categoryName[categoryId as "book"] || ""
            : collectionName[collectionId as "bookmarks"] || ""
        }
      />
    </>
  );
}

export function CardGrid({
  numberOfPages,
  pageNumber,
  query,
  title,
  loading = false,
}: {
  numberOfPages: number;
  pageNumber: number;
  query: Query;
  title?: string;
  loading?: boolean;
}) {
  return (
    <>
      <div className=" mt-2 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-4">{title || "All"}</h1>
          <p className=" -mt-5 mb-4">
            Showing{" "}
            {loading && pageNumber == numberOfPages ? "-" : query.data.length}{" "}
            of {query.count}
          </p>
        </div>
        <div>
          {numberOfPages > 1 && (
            <PaginationComponent
              pageNumber={pageNumber}
              numberOfPages={numberOfPages}
              variant="sm"
            />
          )}
        </div>
      </div>
      {/* <TopBar activeTag={(params.tab as string) || ""} /> */}
      <div className=" grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-2 sm:gap-4">
        {!loading
          ? query.data.map((book) => (
              <BookCard
                key={book.id}
                title={book.title}
                author={book.file_authors
                  .sort((a, b) => a.order - b.order)
                  .map((a: { authors: { name: string } }) => a.authors.name)
                  .join(", ")}
                image={`/remote/${book.cover_path}`}
                slug={"/file/" + book.id}
              />
            ))
          : Array.from({ length: 18 }).map((_, i) => (
              <Card className=" p-0" key={i}>
                <CardContent className="px-0 py-0 pb-2">
                  <div className="animate-pulse bg-gray-200 rounded-lg w-full aspect-[63/94]"></div>
                </CardContent>
              </Card>
            ))}
      </div>

      {numberOfPages > 1 && (
        <PaginationComponent
          pageNumber={pageNumber}
          numberOfPages={numberOfPages}
          className=" mb-6 mt-4"
        />
      )}
    </>
  );
}

function PaginationComponent({
  pageNumber,
  numberOfPages,
  variant = "lg",
  ...props
}: {
  pageNumber: number;
  numberOfPages: number;
  className?: string;
  variant?: "sm" | "lg";
}) {
  return (
    <div className={props.className || ""}>
      <Pagination>
        <PaginationContent>
          {pageNumber != 1 && (
            <PaginationItem>
              <PaginationPrevious href={`?p=${pageNumber - 1}`} />
            </PaginationItem>
          )}
          {variant !== "sm" && (
            <>
              {numberOfPages > 3 && pageNumber > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {Array.from(
                { length: numberOfPages < 3 ? numberOfPages : 3 },
                (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={pageNumber == i + 1}
                      href={`?p=${i + 1}`}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              {numberOfPages > 3 && pageNumber < numberOfPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}
          {pageNumber != numberOfPages && (
            <PaginationItem>
              <PaginationNext href={`?p=${pageNumber + 1}`} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
