import { twMerge } from "tailwind-merge";

export /**
 *
 * @param {*} props
 * @param {string} props.className
 * @param {React.ReactNode} props.children
 * @param {"xs" | "sm" | "base" | "md" | "lg" | "xl"} props.size
 * @param {"primary" | "error" | "warning"} props.variant
 * @param {HTMLButtonElement} ...props
 *
 * @returns {JSX.Element}
 */
const InlineNotification = ({
  children,
  className,
  variant = "warning",
  size = "md",
  ...props
}) => (
  <div
    className={twMerge(
      "select-none [outline:none] w-full border-2 text-black/75",
      size === "xs" ? "text-xs px-4 py-0.5" : "",
      size === "sm" ? "text-sm px-5 py-0.5" : "",
      size === "md" ? "text-base px-6 py-1" : "",
      size === "lg" ? "text-lg px-8 py-1.5" : "",
      size === "xl" ? "text-xl px-10 py-2" : "",
      variant === "warning" ? "bg-warning border-warningHighlight" : "",
      variant === "error" ? "bg-red-200 border-red-300" : "",
      variant === "primary" ? "bg-accentHighlight border-accent" : "",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
