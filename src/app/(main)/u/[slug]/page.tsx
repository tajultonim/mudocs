import { getFilesByUserId } from "@/app/actions/file-action";
import { getUrserById } from "@/app/actions/user-action";
import BookCard from "@/components/book-card";
import InfoBar from "@/components/info-bar";
import supabase from "@/lib/supabase";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch user data from the database
  const [userData, userFiles] = await Promise.all([
    getUrserById(slug),
    getFilesByUserId(slug),
  ]);


  return (
    <div className="flex flex-col gap-2">
      <div className="p-8 bg-gray-800 rounded shadow-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-white">
          {userData.username}
        </h1>
        <InfoBar label="Email" value={userData.email} />
        <InfoBar
          label="Joined"
          value={new Date(userData.created_at).toLocaleDateString()}
        />
      </div>
      <div className="p-8 bg-gray-800 rounded shadow-md w-full ">
        <h2 className="text-xl font-bold mb-4 text-white">User Uploads</h2>
        <div className="grid md:grid-cols-6 grid-cols-3 gap-2">
          {userFiles.map((file) => (
            <BookCard
              image={`https://mudocsstorage.blob.core.windows.net/${file.cover_path}`}
              title={file.title}
              slug={`/file/${file.id}`}
              key={file.id}
              author={
                file.file_authors
                  .sort((a, b) => a.order - b.order)
                  .map((entry) => entry.authors.name)
                  .join(", ") || "Unknown"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const res = await supabase.from("users").select("id"); // returns list of books
  const users = res.data || [];

  return users.map((user: { id: string }) => ({
    slug: user.id,
  }));
}
