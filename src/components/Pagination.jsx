import './Pagination.css';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const safeTotalPages = Math.max(1, totalPages);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (safeTotalPages <= maxVisible) {
      for (let i = 1; i <= safeTotalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(safeTotalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < safeTotalPages - 2) pages.push('...');
      pages.push(safeTotalPages);
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="pagination__btn pagination__btn--arrow"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>←</span>
      </button>

      {getPageNumbers().map((page, index) =>
        page === '...' ? (
          <span key={`dots-${index}`} className="pagination__dots">...</span>
        ) : (
          <button
            key={page}
            className={`pagination__btn ${currentPage === page ? 'pagination__btn--active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className="pagination__btn pagination__btn--arrow"
        onClick={() => onPageChange(Math.min(safeTotalPages, currentPage + 1))}
        disabled={currentPage === safeTotalPages}
        aria-label="Next page"
      >
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>→</span>
      </button>
    </div>
  );
}
