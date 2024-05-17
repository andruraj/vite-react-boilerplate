import { useMemo } from "react";
import PropTypes from "prop-types";
import CircleXmark from "@/assets/icons/duotone/circle-xmark.svg?react";
import MagnifyingGlass from "@/assets/icons/duotone/magnifying-glass.svg?react";
import { twMerge } from "tailwind-merge";
import { isEmpty } from "@/utils/isEmpty";

/**
 * Search Bar
 * @typedef {Object} SearchProps
 * @property {string} value - Search value
 * @property {React.InputHTMLAttributes<HTMLInputElement>.onChange} onChange - onChange event
 * @property {Function} onClear - clear function
 * @property {string} className - extra className to be added to input tag
 * @property {string} [placeholder="Search"]
 *
 * @param {SearchProps & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>} params
 */
export const SearchBar = ({
  value,
  onChange,
  onClear,
  className,
  placeholder,
  ...props
}) => {
  const search = useMemo(
    () => (
      <div className="flex items-center bg-white shadow gap-1 p-1 border border-transparent focus-within:border focus-within:border-accent w-full">
        <MagnifyingGlass className="w-4 h-4 inline-block" />
        <input
          className={twMerge(
            "w-full p-1 outline-none placeholder:italic",
            className
          )}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
        {!isEmpty(value) && (
          <CircleXmark
            className="w-5 h-5 inline-block fill-neutral-800 cursor-pointer"
            onClick={onClear}
          />
        )}
      </div>
    ),
    [value]
  );

  return search;
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func,
};
