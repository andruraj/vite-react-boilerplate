import { Link } from "react-router-dom";

import DefaultIcon from "@/assets/icons/duotone/gear.svg?react";

export const LinkThumbnail = ({ name, iconPath, ...props }) => (
  <Link
    {...props}
    className="flex flex-col items-center justify-center cursor-pointer group w-fit p-4"
  >
    <span className="inline-block p-4 bg-bgGray rounded-md shadow-[2px_2px_0px_#888] ring-[1px] ring-[#888]/25 border border-[#888] group-hover:border-accent group-hover:ring-accent/75 group-hover:scale-[102%] origin-top-left group-hover:shadow-[3px_3px_0px_#0069AA] group-hover:bg-accent/25 text-[#666">
      <span
        className="group-hover:bg-accent w-8 h-8"
        path={iconPath ?? DefaultIcon}
      />
    </span>
    <span className="mt-3 text-sm text-center text-accent group-hover:text-accent/80 font-bold w-24">
      {name}
    </span>
  </Link>
);
