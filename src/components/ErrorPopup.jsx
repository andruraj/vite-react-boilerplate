import { isEmpty } from "@/utils/isEmpty";
import { Modal } from "./Modal";
import { getErrorMessage } from "@/utils/getErrors";
import CircleXmark from "@/assets/icons/duotone/circle-xmark.svg?react";

/**
 * The `ErrorPopup` component is a JavaScript function that renders a modal popup displaying an error
 * message and optional extra content.
 *
 * @param {{error: unknown, onClose: () => void, extraContent: string | React.ReactNode, closeBtnText: string}}
 * @returns {React.ReactNode} The code is returning a React component called "ErrorPopup".
 */
export const ErrorPopup = ({
  error = "Something went wrong!",
  onClose,
  extraContent = "",
  closeBtnText = "OK",
}) => (
  <Modal
    placement="center"
    onClose={onClose}
    closeBtn={false}
    cancelBtn
    cancelText={closeBtnText}
  >
    <div className="max-w-[50vw] max-h-[50vh] overflow-auto m-2">
      <div className="flex items-center gap-4">
        <CircleXmark className="w-12 h-12 inline-block fill-red-500" />
        <div className="">{getErrorMessage(error)}</div>
      </div>
      {!isEmpty(extraContent) && <div className="mt-4">{extraContent}</div>}
    </div>
  </Modal>
);
