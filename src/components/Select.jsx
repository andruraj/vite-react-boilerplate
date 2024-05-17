import { useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { isEmpty } from "@/utils/isEmpty";
import { Portal } from "./Portal";
import { Collapsible } from "./Collapsible";
import { ArrowIconC } from "./BasicIcons";

/**
 * @typedef {object} GroupOptions
 * @property {string} groupName - Header or Group name
 * @property {(string[] | object[])} options - List of distinct options for the group
 * @property {string[]} [keyProp] - List of Groups and its distinct options
 *
 *
 * @typedef {object} SelectProps
 * @property {string} value - Currently selected value.
 * @property {(currentOptionString: string, currentOptionObject: object, search: string) => void} onChange - Function called when a new value is selected.
 * @property {boolean} [searchable=true] - Boolean indicating if the dropdown is searchable.
 * @property {string} [placeholder] - Placeholder text for the input field.
 * @property {(string[] | object[] | GroupOptions[])} options - List of options to display in the dropdown.
 * @property {string} [keyProp] - Property to be used as a key within the objects of the options list. Mandatory if options is a list of string or object
 * @property {boolean} [disabled] - Disable Select
 * @property {string | number} [width] - Width
 * @property {number} [zIndex] - zIndex
 * @property {string | number} [fontSize] - FontSize
 * @property {boolean} [required] - Required
 *
 * Select component
 * @param {SelectProps} props - Select component props.
 * @returns {JSX.Element} - React JSX Element
 */
export const Select = ({
  value,
  onChange,
  options = [],
  keyProp,
  searchable = true,
  placeholder = "Select an Option",
  disabled,
  width,
  zIndex,
  fontSize = 16,
  required = false,
  onBlur,
  onInvalid,
}) => {
  const [selectState, setSelectState] = useState({
    collapse: true,
    highlighted: "",
    selected: value ?? "",
  });
  const [search, setSearch] = useState("");

  const { collapse, highlighted, selected } = selectState;

  const mainContainerRef = useRef();
  const optionsContainerRef = useRef();

  useEffect(() => {
    if (selectState.selected !== value) {
      setSelectState({ ...selectState, selected: value ?? "" });
    }
  }, [value, selectState]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mainContainerRef.current &&
        !mainContainerRef.current.contains(e.target) &&
        optionsContainerRef.current &&
        !optionsContainerRef.current.contains(e.target)
      ) {
        setSelectState((prevState) => ({
          ...prevState,
          collapse: true,
          highlighted: "",
        }));
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("focusin", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("focusin", handleClickOutside);
    };
  }, []);

  const isGrouped = useMemo(() => {
    if (!isEmpty(options)) {
      for (const option of options) {
        if (
          option &&
          typeof option === "object" &&
          option.hasOwnProperty("groupName")
        ) {
          return true;
        }
      }
    }
    return false;
  }, [options]);

  useEffect(() => {
    if (!!optionsContainerRef.current && !!highlighted) {
      const selectedElement = optionsContainerRef.current.querySelector(
        `[data-value="${
          isGrouped ? highlighted.match(/_group_(.+)/)[1] : highlighted
        }"]`
      );

      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "instant",
          block: "nearest",
        });
      }
    }
  }, [highlighted, isGrouped]);

  const handleKeyPress = (e) => {
    if (collapse) return;

    const fromOptions = !isGrouped
      ? filteredOptions
      : [].concat(
          ...filteredOptions.map((g) =>
            g.options.map(
              (go) =>
                g.groupName +
                "_group_" +
                (typeof go === "object" ? go[g.keyProp] : go)
            )
          )
        );

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        const nextIndex = Math.min(
          fromOptions.indexOf(highlighted) + 1,
          fromOptions.length - 1
        );
        setSelectState((prevState) => ({
          ...prevState,
          highlighted: fromOptions[nextIndex],
        }));
        break;
      case "ArrowUp":
        e.preventDefault();
        const prevIndex = Math.max(fromOptions.indexOf(highlighted) - 1, 0);
        setSelectState((prevState) => ({
          ...prevState,
          highlighted: fromOptions[prevIndex],
        }));
        break;
      case "Enter":
        e.preventDefault();
      case " ":
        e.preventDefault();
        if (!isEmpty(highlighted)) {
          const highlightedValue = isGrouped
            ? highlighted.match(/_group_(.+)/)[1]
            : typeof highlighted === "object" && !!keyProp
            ? highlighted[keyProp]
            : highlighted;
          setSelectState((prevState) => ({
            ...prevState,
            selected: highlightedValue,
            collapse: true,
            highlighted: "",
          }));
          setSearch("");
          onChange(
            highlightedValue,
            isGrouped
              ? options.filter(
                  (g) => g.groupName === highlighted.match(/(.+)_group_/)[1]
                )
              : highlighted,
            search
          );
        }
        break;
      case "Escape":
        e.preventDefault();
        setSelectState((prevState) => ({
          ...prevState,
          collapse: true,
          highlighted: "",
        }));
        setSearch("");
        break;
      default:
        break;
    }
  };

  const handleOptionClick = (item, e, itemKeyProp = undefined) => {
    e.preventDefault();
    e.stopPropagation();

    const itemValue =
      typeof item === "object" && !!itemKeyProp ? item[itemKeyProp] : item;

    setSelectState((prevState) => ({
      ...prevState,
      collapse: true,
      highlighted: "",
      selected: itemValue,
    }));
    setSearch("");

    onChange(itemValue, item, search);
  };

  const filteredOptions = useMemo(() => {
    const searchFilter = (opts, key) => {
      if (!Array.isArray(opts)) return [];
      if (!searchable || isEmpty(String(search).trim())) return opts;

      return opts.filter((item) =>
        typeof item === "object"
          ? String(item[key])
              ?.toLowerCase()
              ?.includes(String(search).trim().toLowerCase())
          : String(item)
              .toLowerCase()
              .includes(String(search).trim().toLowerCase())
      );
    };

    if (isGrouped) {
      return options.map((group) => ({
        groupName: group.groupName,
        options: searchFilter(group.options, group.keyProp),
        keyProp: group.keyProp,
      }));
    }

    return searchFilter(options, keyProp);
  }, [options, keyProp, search, searchable]);

  return (
    <div
      id="select"
      className={twMerge(
        "flex flex-col h-fit bg-white text-black",
        disabled ? "opacity-50 touch-none pointer-events-none" : ""
      )}
      style={{ minWidth: width, width, maxWidth: width, fontSize }}
      ref={mainContainerRef}
      onKeyDown={handleKeyPress}
    >
      <div
        className={twMerge(
          "flex items-center justify-between w-full bg-white text-black border divide-x cursor-pointer outline-none focus:border-sky-500/50 py-1",
          collapse ? "" : "border-sky-500/50"
        )}
        onClick={() =>
          setSelectState((prevState) => ({
            ...prevState,
            collapse: !prevState.collapse,
          }))
        }
        role="combobox"
        aria-expanded={!collapse}
        aria-haspopup="listbox"
        aria-controls="options-list"
        aria-owns="options-list"
        id="selected"
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            setSelectState((prevState) => ({
              ...prevState,
              collapse: !prevState.collapse,
            }));
          }
        }}
        aria-label="Toggle dropdown"
        tabIndex={0}
        onBlur={onBlur}
        data-input
      >
        <div
          className={twMerge(
            "px-2 flex items-center justify-between w-full",
            isEmpty(selected) ? "text-[#a9a9ac]" : "text-black"
          )}
        >
          <div>
            {isEmpty(selected) ? <span>{placeholder}</span> : null}

            <span data-mandatory={required}>
              {!isEmpty(selected) ? selected : null}

              <input type="hidden" value={selected} onInvalid={onInvalid} />
            </span>
          </div>
          <div>
            {isEmpty(selected) ? null : (
              <Xbtn
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setSelectState((prevState) => ({
                    ...prevState,
                    collapse: false,
                    highlighted: "",
                    selected: "",
                  }));
                  setSearch("");

                  onChange("", null, "");
                }}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();

                    setSelectState((prevState) => ({
                      ...prevState,
                      collapse: false,
                      highlighted: "",
                      selected: "",
                    }));
                    setSearch("");

                    onChange("", null, "");
                  }
                }}
                tabIndex={0}
              />
            )}
          </div>
        </div>
        <div className="px-2">
          {collapse ? (
            <ArrowIconC direction="down" />
          ) : (
            <ArrowIconC direction="up" />
          )}
        </div>
      </div>
      {collapse ? null : (
        <Portal id="select-options">
          <div
            id="options"
            className="flex flex-col w-full absolute bg-white text-black border overflow-hidden border-sky-500/50"
            style={{
              top:
                mainContainerRef.current.getBoundingClientRect().bottom +
                2 +
                "px",
              left:
                mainContainerRef.current.getBoundingClientRect().left + "px",
              width:
                width ??
                mainContainerRef.current.getBoundingClientRect().width + "px",
              maxHeight: "200px",
              overflowY: "auto",
              zIndex: zIndex ?? 1,
              fontSize: fontSize,
            }}
            ref={optionsContainerRef}
            role="listbox"
            aria-labelledby="options-list"
          >
            <div className="flex items-center justify-between w-full">
              <div className="px-2 w-full">
                <input
                  className="outline-none bg-transparent border-b border-black/25 py-1 w-full"
                  type="text"
                  value={search}
                  placeholder="Search..."
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                  tabIndex={0}
                  aria-autocomplete="list"
                  aria-controls="options-list"
                  aria-label="Search"
                />
              </div>
              <div className="pr-2">
                {isEmpty(search) ? null : (
                  <Xbtn
                    onClick={() => setSearch("")}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();

                        setSearch("");

                        const searchElement =
                          e.target?.parentElement?.previousElementSibling
                            ?.children[0];

                        if (searchElement) searchElement.focus();
                      }
                    }}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col w-full overflow-auto">
              {isGrouped
                ? filteredOptions.map((group, groupIndex) => (
                    <Collapsible
                      key={groupIndex}
                      isCollapsed={false}
                      header={group.groupName}
                      content={
                        <div className="flex flex-col w-full text-black bg-white">
                          {group.options.map((item, index) => (
                            <div
                              key={index}
                              className={twMerge(
                                "px-2 py-1 cursor-pointer bg-white text-black hover:bg-accentHighlight hover:text-white w-full",
                                !!highlighted &&
                                  highlighted.indexOf(group.groupName) !== -1 &&
                                  highlighted.indexOf(
                                    typeof item === "object"
                                      ? item[group.keyProp]
                                      : item
                                  ) !== -1
                                  ? "bg-accentHighlight text-white"
                                  : !!selected &&
                                    selected === item &&
                                    !highlighted
                                  ? "bg-gray-200"
                                  : ""
                              )}
                              onClick={(e) =>
                                handleOptionClick(item, e, group.keyProp)
                              }
                              data-key={
                                typeof item === "object"
                                  ? item[group.keyProp]
                                  : item
                              }
                            >
                              {typeof item === "object"
                                ? item[group.keyProp]
                                : item}
                            </div>
                          ))}
                        </div>
                      }
                    />
                  ))
                : filteredOptions.map((item, index) => (
                    <div
                      key={index}
                      className={twMerge(
                        "px-2 py-1 cursor-pointer bg-white text-black hover:bg-accentHighlight hover:text-white w-full",
                        !!highlighted && highlighted === item
                          ? "bg-accentHighlight text-white"
                          : !!selected && selected === item
                          ? "bg-gray-200"
                          : ""
                      )}
                      onClick={(e) => handleOptionClick(item, e, keyProp)}
                      data-key={index}
                      data-value={
                        typeof item === "object" ? item[keyProp] : item
                      }
                    >
                      {typeof item === "object" ? item[keyProp] : item}
                    </div>
                  ))}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

/**
 *
 * @param {React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>} props
 * @returns {JSX.Element}
 */
const Xbtn = (props) => (
  <div
    className={twMerge(
      "h-4 w-4 flex items-center justify-center rounded-full bg-red-400 cursor-pointer",
      props.className
    )}
    {...props}
  >
    <div className="text-white font-bold text-xs leading-none -mt-0.5">
      &times;
    </div>
  </div>
);
