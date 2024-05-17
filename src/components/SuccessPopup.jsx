import { isEmpty } from "@/utils/isEmpty";
import { Modal } from "./Modal";

import CircleCheck from "@/assets/icons/duotone/circle-check.svg?react";
import { Button } from "./Button";

/**
 * The `SuccessPopup` component is a JavaScript function that renders a modal popup displaying an error
 * message and optional extra content.
 *
 * @param {{message: string | React.ReactNode, success: boolean, onOK: () => void, extraContent: string | React.ReactNode}
 * & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>}
 * @returns {React.ReactNode} The code is returning a React component called "SuccessPopup".
 */
export const SuccessPopup = ({
  message = "Success",
  extraContent,
  success,
  onOK,
  ...props
}) =>
  success ? (
    <Modal placement="center" closeBtn={false} {...props}>
      <div className="text-2xl m-2">
        <div className="flex items-center gap-4">
          <span>{message}</span>{" "}
          <CircleCheck className="w-8 h-8 inline-block fill-green-500" />
        </div>
        <div className="mt-4">{!isEmpty(extraContent) && extraContent}</div>
      </div>
      <div className="text-center">
        <Button
          onClick={(e) => {
            e.preventDefault();
            !isEmpty(onOK) && onOK();
          }}
        >
          OK
        </Button>
      </div>
    </Modal>
  ) : null;
