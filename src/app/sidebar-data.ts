import { BookCopy, BookMarked, FileText, LibraryBig } from "lucide-react";

export const exploreData = [
  {
    title: "Bookmarks",
    slug: "#",
    icon: BookMarked,
    items: [
      {
        title: "All",
        slug: "/explore/bookmarks",
      },
      {
        title: "Books",
        slug: "/explore/bookmarks/book",
      },
      {
        title: "Papers",
        slug: "/explore/bookmarks/paper",
      },
      {
        title: "Notes",
        slug: "/explore/bookmarks/note",
      },
      {
        title: "Others",
        slug: "/explore/bookmarks/other",
      },
    ],
  },
  {
    title: "Collection",
    slug: "#",
    icon: BookCopy,
    items: [
      {
        title: "All",
        slug: "/explore/collection",
      },
      {
        title: "Books",
        slug: "/explore/collection/book",
      },
      {
        title: "Papers",
        slug: "/explore/collection/paper",
      },
      {
        title: "Notes",
        slug: "/explore/collection/note",
      },
      {
        title: "Others",
        slug: "/explore/collection/other",
      },
    ],
  },
  {
    title: "E Library",
    slug: "#",
    icon: FileText,
    items: [
      {
        title: "All",
        slug: "/explore/e-lib",
      },
      {
        title: "Books",
        slug: "/explore/e-lib/book",
      },
      {
        title: "Papers",
        slug: "/explore/e-lib/paper",
      },
      {
        title: "Notes",
        slug: "/explore/e-lib/note",
      },
      {
        title: "Others",
        slug: "/explore/e-lib/other",
      },
    ],
  },
  {
    title: "Offline",
    slug: "/s-lib",
    icon: LibraryBig,
    items: [
      {
        title: "All",
        slug: "/explore/s-lib",
      },
      {
        title: "Books",
        slug: "/explore/s-lib/book",
      },
      {
        title: "Papers",
        slug: "/explore/s-lib/paper",
      },
      {
        title: "Notes",
        slug: "/explore/s-lib/note",
      },
      {
        title: "Others",
        slug: "/explore/s-lib/other",
      },
    ],
  },
];
