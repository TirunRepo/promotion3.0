import React from "react";
import { Pagination, Form } from "react-bootstrap";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
}) => {
  if (totalPages <= 1) return null;

  const pageNeighbors = 2;
  const pages: (number | string)[] = [];

  // Add first + ellipsis
  if (currentPage > pageNeighbors + 2) pages.push(1, "...");

  // Main range
  for (
    let i = Math.max(1, currentPage - pageNeighbors);
    i <= Math.min(totalPages, currentPage + pageNeighbors);
    i++
  ) {
    pages.push(i);
  }

  // Add last + ellipsis
  if (currentPage < totalPages - pageNeighbors - 1) pages.push("...", totalPages);

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      {/* Page size dropdown */}
      <Form.Select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        style={{ width: "auto", minWidth: "100px" }}
      >
        {[5, 10, 15, 20, 35, 50, 75, 100].map((size) => (
          <option key={size} value={size}>
            {size} / page
          </option>
        ))}
      </Form.Select>

      {/* Pagination */}
      <Pagination className="mb-0">
        <Pagination.Prev
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {pages.map((page, idx) =>
          typeof page === "number" ? (
            <Pagination.Item
              key={idx}
              active={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Pagination.Item>
          ) : (
            <Pagination.Ellipsis key={idx} disabled />
          )
        )}
        <Pagination.Next
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
};

export default CustomPagination;
