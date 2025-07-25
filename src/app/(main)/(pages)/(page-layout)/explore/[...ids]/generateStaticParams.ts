import { exploreData } from "@/app/sidebar-data";

const pathIDArray = [
  ...new Set(
    exploreData
      .map((item) => {
        return [...item.items.map((subitem) => subitem.slug)];
      })
      .flat()
      .map((s) => s.replace("/explore/", "").split("/"))
  ),
].map((items) => {
  return {
    ids: items,
  };
});

export const collections = [
  ...new Set(
    pathIDArray
      .filter((item) => item.ids[0])
      .map((item) => {
        return item.ids[0];
      })
  ),
];

export const categorys = [
  ...new Set(
    pathIDArray
      .filter((item) => item.ids[1])
      .map((item) => {
        return item.ids[1];
      })
  ),
];

export async function generateStaticParams() {
  try {
    return pathIDArray;
  } catch (error) {
    console.log(error);
    return [{ ids: [] }];
  }
}
