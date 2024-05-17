import { useEffect, useState } from "react";

/**
 *
 * @typedef {object} DebouncedInput
 * @property {string} value - value for input
 * @property {function} onChange - onChange event
 * @property {number} debounce - time of debounce in milliseconds
 *
 * @param {DebouncedInput & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>} params
 * @returns {JSX.Element}
 */
export const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // 0.5s after setValue in state
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
