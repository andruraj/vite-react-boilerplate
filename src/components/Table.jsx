import { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  sortingFns,
  useReactTable,
} from "@tanstack/react-table";
import { twMerge } from "tailwind-merge";

import MagnifyingGlass from "@/assets/icons/duotone/magnifying-glass.svg?react";
import Sort from "@/assets/icons/solid/sort.svg?react";
import SortUp from "@/assets/icons/solid/sort-up.svg?react";
import SortDown from "@/assets/icons/solid/sort-down.svg?react";
import { DebouncedInput } from "./DebouncedInput";

/**
 * Table built using tanstack react table v8
 * @typedef {Object} TableProps - Table Props
 * @property {[any]} data - Input data - array of objects.
 * @property {[import("@tanstack/react-table").Column]} columns - Array of Column options.
 * @property {boolean} enableSearch - Enable or Disable Search.
 * @property {boolean} enablePageSizeChange - Enable or Disable PageSizeChange.
 * @property {boolean} enablePageInfo - Enable or Disable PageInfo.
 * @property {boolean} enablePageInput - Enable or Disable PageInput.
 * @property {boolean} enablePagination - Enable or Disable Pagination.
 * @property {number} defaultPageSize - Specify initial or default pageSize in the 'shows' select.
 * @property {(number) => void} onPageSizeChange - returns the page index or page number when a change is made in go to page.
 *
 * @param {TableProps} params
 * @returns {JSX.Element}
 */
export const Table = ({
  data: inputData = [],
  columns: inputColumns = [],
  enableSearch = true,
  enablePageSizeChange = true,
  enablePageInfo = true,
  enablePageInput = true,
  enablePagination = true,
  defaultPageSize = 10,
  onPageSizeChange,
  //   showStatus = "row",
}) => {
  const [data, setData] = useState(() => [...inputData]);
  // const [columns, setColumns] = useState(() => [...inputColumns]);

  const memorizedData = useMemo(() => [...inputData], [inputData]);

  const memorizedColumns = useMemo(() => [...inputColumns], [inputColumns]);

  const [pageSize, setPageSize] = useState(() => defaultPageSize ?? 10);

  const [globalFilter, setGlobalFilter] = useState("");

  const [sorting, setSorting] = useState(
    memorizedColumns
      .filter((col) => !!col?.sort)
      .map((col) => ({
        id: col.accessorKey ? col.accessorKey : col.id,
        desc: col?.sort?.toLowerCase() === "desc" ? true : false,
      }))
  );

  const table = useReactTable({
    data: memorizedData,
    columns: memorizedColumns,
    state: {
      globalFilter,
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
    sortingFns: {
      defaultSort: (rowA, rowB, columnId) => {
        let dir = 0;

        // Only sort by rank if the column has ranking information
        if (rowA.columnFiltersMeta[columnId]) {
          dir = compareItems(
            rowA.columnFiltersMeta[columnId]?.itemRank,
            rowB.columnFiltersMeta[columnId]?.itemRank
          );
        } else {
          if (rowA instanceof Date && rowB instanceof Date) {
            dir = sortingFns.datetime(rowA, rowB, columnId);
          } else {
            // Provide an alphanumeric fallback for when the item ranks are equal
            dir =
              dir === 0
                ? sortingFns.alphanumericCaseSensitive(rowA, rowB, columnId)
                : dir;
          }

          return dir;
        }
      },
    },
    sortDescFirst: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableMultiSort: true,
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: "onChange",
    meta: {
      updateData: (rowIndex, columnId, value) =>
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? {
                  ...prev[rowIndex],
                  [columnId]: value,
                }
              : row
          )
        ),
    },
  });

  return (
    <div
      id="table-container"
      className="h-full w-full flex flex-col gap-2 overflow-hidden"
    >
      {enableSearch || enablePageSizeChange ? (
        <header className="flex items-center justify-between">
          {enableSearch && (
            <SearchFilter
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          )}
          {enablePageSizeChange && (
            <PageSizeModifier
              pageSize={table.getState().pagination.pageSize}
              setPageSize={table.setPageSize}
              onPageSizeChange={onPageSizeChange}
            />
          )}
        </header>
      ) : null}

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-black border-collapse border border-slate-500">
          <thead className="text-xs bg-primary text-white sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    scope="col"
                    key={header.id}
                    className="relative group/th uppercase font-semibold border border-slate-600"
                    style={{
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : "default",
                      minWidth: header.column.columnDef?.width,
                      width: header.column.columnDef?.width,
                      maxWidth: header.column.columnDef?.width,
                      ...header.column.columnDef?.headerStyle,
                    }}
                    // style={{width: header.column.getSize()}}
                    colSpan={header.colSpan}
                  >
                    <div
                      onClick={() =>
                        header.column.toggleSorting(
                          null,
                          header.column.getCanMultiSort()
                        )
                      }
                      className="flex items-center justify-between px-3 py-2"
                    >
                      <span className="overflow-hidden text-ellipsis ...">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </span>
                      {header.column.getCanSort()
                        ? {
                            asc: (
                              <SortUp className="w-4 h-4 block fill-white" />
                            ),
                            desc: (
                              <SortDown className="w-4 h-4 block fill-white" />
                            ),
                            false: (
                              <Sort className="w-4 h-4 block fill-white" />
                            ),
                          }[header.column.getIsSorted()] ?? null
                        : null}
                    </div>
                    {header.column.columnDef.enableResizing ? (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        id="resizer"
                        className={twMerge(
                          "absolute opacity-0 top-0 right-0 h-full w-1 bg-accent cursor-col-resize select-none touch-none rounded-md",
                          header.column.getIsResizing()
                            ? "bg-accentHighlight opacity-100"
                            : "bg-accent group-hover/th:opacity-100"
                        )}
                      ></div>
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="h-full w-full">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      scope="row"
                      className="px-3 py-2 border border-slate-700 overflow-hidden"
                      key={cell.id}
                      style={{
                        minWidth: cell.column.columnDef?.width,
                        width: cell.column.columnDef?.width,
                        maxWidth: cell.column.columnDef?.width,
                        ...cell.column.columnDef?.style,
                      }}
                      // style={{ width: cell.column.getSize() }}
                    >
                      {" "}
                      {flexRender(
                        cell.column.columnDef?.editable
                          ? EditableCell
                          : cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="w-full">
                <td
                  colSpan={table.getAllColumns().length}
                  className="text-center py-2 px-3"
                >
                  No Records Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {enablePageInfo || enablePageInput || enablePagination ? (
        <footer className="flex items-center justify-between">
          {/* Row Status */}
          {/* {showStatus === "row" ? ( */}
          {enablePageInfo ? (
            <div className="">
              Showing{" "}
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}{" "}
              to{" "}
              {(table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize <
              table.getCoreRowModel().rows.length
                ? (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize
                : table.getCoreRowModel().rows.length}{" "}
              of {table.getCoreRowModel().rows.length} entries
            </div>
          ) : null}
          {/* ) : null} */}

          {/* Page Status */}
          {/* {showStatus === "page" ? (
          <div className="">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
        ) : null} */}

          {/* Go to Page */}
          {enablePageInput ? (
            <div className="flex items-center gap-1">
              Go to page:
              <input
                className="bg-transparent border border-transparent border-b-gray-400 text-gray-900 text-sm outline-none focus:border-b-[#256fa3] py-1 w-5 text-center"
                type="text"
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const res = e.target.value.replace(/\D+/g, "");

                  const IpgNo = Number(res);
                  let FpgNo = 1;
                  if (IpgNo > table.getPageCount())
                    FpgNo = table.getPageCount();
                  else if (Number.isNaN(IpgNo) || IpgNo < 1) FpgNo = 1;
                  else FpgNo = IpgNo;

                  e.target.style.width = String(FpgNo).length + 2 + "ch";
                  table.setPageIndex(Number(FpgNo) - 1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") {
                    table.setPageIndex((v) =>
                      v < table.getPageCount() - 1
                        ? v + 1
                        : table.getPageCount() - 1
                    );
                  }
                  if (e.key === "ArrowDown") {
                    table.setPageIndex((v) => (v > 1 ? v - 1 : 0));
                  }
                }}
              />{" "}
              of {table.getPageCount()}
            </div>
          ) : null}

          {/* Pagination */}
          {/* {!isEmpty(customPagination) && isValidElement(customPagination) ? (
          customPagination
        ) : ( */}
          {enablePagination ? (
            <Pagination
              currentPage={table.getState().pagination.pageIndex + 1}
              totalPages={table.getPageCount()}
              onPageChange={(n) => table.setPageIndex(n - 1)}
            />
          ) : null}
          {/* )} */}
        </footer>
      ) : null}
    </div>
  );
};

const EditableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full overflow-hidden text-ellipsis whitespace-nowrap"
      onBlur={() => table.options.meta?.updateData(row.index, column.id, value)}
    />
  );
};

const SearchFilter = ({ globalFilter, setGlobalFilter }) => (
  <div className="flex items-center gap-1 rounded-sm w-fit">
    <MagnifyingGlass className="w-4 h-4 block bg-transparent pointer-events-none" />
    <DebouncedInput
      type="text"
      className="p-0.5 bg-transparent outline-none border-b-2 hover:border-primary focus-within:border-primary duration-300"
      placeholder="Search..."
      value={globalFilter ?? ""}
      onChange={(value) => setGlobalFilter(String(value))}
    />
  </div>
);

const PageSizeModifier = ({ setPageSize, pageSize, onPageSizeChange }) => {
  return (
    <select
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded outline-none focus:ring-[#256fa3] focus:border-[#256fa3] block py-1"
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
        typeof onPageSizeChange === "function"
          ? onPageSizeChange(Number(e.target.value))
          : null;
      }}
    >
      {[5, 10, 25, 50, 100, 500].map((size) => (
        <option key={size} value={size}>
          Show {size}
        </option>
      ))}
    </select>
  );
};

/**
 *
 *
 * @param {{
 *   currentPage: number;
 *   totalPages: number;
 *   onPageChange: (page: number) => void;
 * }} {
 *   currentPage,
 *   totalPages,
 *   onPageChange,
 * }
 * @return {*}
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = useMemo(() => {
    const current = currentPage + 1;
    let startPage = 1;
    let endPage;

    if (totalPages <= 5) {
      // less than 5 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 5 total pages so calculate start and end pages
      if (current <= 2) {
        startPage = 1;
        endPage = 3;
      } else if (current >= totalPages) {
        startPage = totalPages - 2;
        endPage = totalPages;
      } else {
        startPage = current - 2;
        endPage = current;
      }
    }

    return [...Array(endPage - startPage + 1)]
      .map((_, i) => startPage + i)
      .map((p) => (
        <NumberButton
          active={currentPage === p}
          key={p}
          onClick={() => onPageChange(Number(p))}
        >
          {p}
        </NumberButton>
      ));
  }, [currentPage, totalPages]);

  return (
    <div>
      <div className="inline-flex -space-x-px text-sm">
        <button
          onClick={() => {
            let current = currentPage;
            if (currentPage > 1) {
              current = current - 1;
            }
            onPageChange(current);
          }}
          disabled={currentPage <= 1}
          className="outline-none focus-visible:ring-[1px] flex items-center justify-center px-3 h-8 leading-tight text-white bg-primary border border-gray-300 hover:bg-accent cursor-pointer disabled:cursor-not-allowed disabled:bg-transparent/10 disabled:text-neutral-400"
        >
          Previous
        </button>

        {pageNumbers}

        <button
          onClick={() => {
            let current = currentPage;
            if (currentPage < totalPages) {
              current = current + 1;
            }
            onPageChange(current);
          }}
          disabled={currentPage >= totalPages}
          className="outline-none focus-visible:ring-[1px] flex items-center justify-center px-3 h-8 leading-tight text-white bg-primary border border-gray-300 hover:bg-accent cursor-pointer disabled:cursor-not-allowed disabled:bg-transparent/10 disabled:text-neutral-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

/**
 *
 * @param {{children: React.ReactNode, active: boolean, className: string}
 * & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>} params
 * @returns {React.ReactNode}
 */
const NumberButton = ({ children, active, className, ...props }) => (
  <button
    className={twMerge(
      "outline-none focus-visible:ring-[1px] flex items-center justify-center px-3 h-8 leading-tight  border border-gray-300 cursor-pointer",
      active
        ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
        : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    )}
    {...props}
  >
    {children}
  </button>
);
