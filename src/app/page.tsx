import BookCard from "@/components/book-card";
import TopBar from "@/components/topbar";

const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    image: "https://picsum.photos/200/300?random=1",
    slug: "/",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    image: "https://picsum.photos/200/300?random=2",
    slug: "/",
  },
  {
    title: "1984",
    author: "George Orwell",
    image: "https://picsum.photos/200/300?random=3",
    slug: "/",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    image: "https://picsum.photos/200/300?random=4",
    slug: "/",
  },
  {
    title: "Moby Dick",
    author: "Herman Melville",
    image: "https://picsum.photos/200/300?random=5",
    slug: "/",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    image: "https://picsum.photos/200/300?random=6",
    slug: "/",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    image: "https://picsum.photos/200/300?random=7",
    slug: "/",
  },
  {
    title: "1984",
    author: "George Orwell",
    image: "https://picsum.photos/200/300?random=8",
    slug: "/",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    image: "https://picsum.photos/200/300?random=9",
    slug: "/",
  },
  {
    title: "Moby Dick",
    author: "Herman Melville",
    image: "https://picsum.photos/200/300?random=10",
    slug: "/",
  },
  {
    title: "1984",
    author: "George Orwell",
    image: "https://picsum.photos/200/300?random=11",
    slug: "/",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    image: "https://picsum.photos/200/300?random=12",
    slug: "/",
  },
  {
    title: "Moby Dick",
    author: "Herman Melville",
    image: "https://picsum.photos/200/300?random=13",
    slug: "/",
  },
];

export default function Home() {
  return (
    <>
      <TopBar />
      <div className=" grid lg:grid-cols-6 sm:grid-cols-3 grid-cols-2 gap-4">
        {books.slice(0, 12).map((book, index) => (
          <BookCard
            key={index}
            title={book.title}
            author={book.author}
            image={book.image}
            slug={book.slug}
          />
        ))}
      </div>
    </>
  );
}
