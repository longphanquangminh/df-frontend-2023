interface PaginationProps {
  currentPage: number
  totalLength: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalLength,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalLength / itemsPerPage)
  const paginationButtonClass =
    'font-bold text-black text-center px-2 py-1 border-2 border-gray-500 rounded w-12'
  const renderPageButtons = () => {
    const buttons: JSX.Element[] = []

    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          title="paginationButton"
          key={i}
          onClick={() => onPageChange(i)}
          className={`${paginationButtonClass} ${
            currentPage === i ? 'bg-gray-300' : 'bg-white'
          }`}
        >
          {i}
        </button>,
      )
    }

    return buttons
  }

  return (
    <div>
      {totalLength > itemsPerPage && (
        <div className="flex justify-end gap-x-3 my-3">
          {currentPage !== 1 && (
            <button
              title="turnToPreviousPageButton"
              className={`${paginationButtonClass} bg-white`}
              onClick={() => onPageChange(currentPage - 1)}
            >
              {'<'}
            </button>
          )}
          {renderPageButtons()}
          {currentPage !== totalPages && (
            <button
              title="turnToNextPageButton"
              className={`${paginationButtonClass} bg-white`}
              onClick={() => onPageChange(currentPage + 1)}
            >
              {'>'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
