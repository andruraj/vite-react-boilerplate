import { isEmpty } from "@/utils/isEmpty";
import { RoundedIconButton } from "./RoundedIconButton";
import RotateRight from "@/assets/icons/duotone/rotate-right.svg?react";
import House from "@/assets/icons/duotone/house.svg?react";

/**
 *
 * @param {{errorHeader: string, errorMsg: string}} params
 * @returns {React.ReactNode}
 */
export const ErrorComponent = ({ errorHeader = "", errorMsg = "" }) => (
  <div className="flex items-center justify-center w-full h-full bg-bgToolBar">
    <div className="px-20 py-10 bg-white rounded-lg shadow-xl w-full h-full sm:max-w-3xl sm:max-h-96 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="mb-2 font-bold text-accent text-9xl">404</h1>

        <h6 className="mb-2 text-2xl font-bold text-center text-black md:text-3xl">
          <span className="text-red-500">Oops!</span>{" "}
          {isEmpty(errorHeader) ? "Something went wrong!" : errorHeader}
        </h6>

        <p className="mb-4 text-center text-gray-500 md:text-lg">{errorMsg}</p>

        <div className="flex items-center justify-between gap-8">
          <span
            className="cursor-pointer flex items-center gap-2 group/reset"
            title="Home"
            onClick={() => window.location.replace("/")}
          >
            <RoundedIconButton className="group-hover/reset:shadow group-hover/reset:shadow-black">
              <House className="w-5 h-5 inline-block" />
            </RoundedIconButton>
            Home
          </span>
          <span
            className="cursor-pointer flex items-center gap-2 group/reset"
            title="Try Again"
            onClick={() => window.location.reload()}
          >
            <RoundedIconButton className="group-hover/reset:shadow group-hover/reset:shadow-black">
              <RotateRight className="w-5 h-5 inline-block" />
            </RoundedIconButton>
            Try Again
          </span>
        </div>
      </div>
    </div>
  </div>
);
