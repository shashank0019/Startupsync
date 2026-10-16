import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      // Calculate range around current page
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 1) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages - 1);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0 || disabled}
        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, idx) =>
          typeof page === 'string' ? (
            <span key={idx} className="px-2 py-1 text-gray-600">
              {page}
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => onPageChange(page)}
              disabled={disabled}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {page + 1}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1 || disabled}
        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Next
      </button>
    </div>
  );
};
