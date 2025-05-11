import { IconType } from "react-icons";

export default function IconButton({ Icon }: { Icon: IconType }) {
  return (
    <button className=" cursor-pointer bg-gray-800 h-8 p-2 aspect-square rounded-full">
      <Icon/>
    </button>
  );
}
