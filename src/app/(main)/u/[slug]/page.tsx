import { getFilesByUserId } from "@/app/actions/file-action";
import { getUrserById } from "@/app/actions/user-action";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import supabase from "@/lib/supabase";
import { CardGrid } from "../../(pages)/(page-layout)/explore/[...ids]/page-content";

export const dynamicParams = false;

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
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {userData.full_name || userData.username}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <CardGrid
        numberOfPages={Math.ceil(userFiles.count / 17)}
        pageNumber={1}
        query={userFiles}
        title={`Uploaded by ${userData.full_name || userData.username}`}
      />
    </>
  );
}

export async function generateStaticParams() {
  const res = await supabase.from("users").select("id"); // returns list of books
  const users = res.data || [];

  return users.map((user: { id: string }) => ({
    slug: user.id,
  }));
}
