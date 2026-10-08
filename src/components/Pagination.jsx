const baseButton =
  'h-10 min-w-10 px-3 rounded-lg border text-sm font-medium flex items-center justify-center transition'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, function (_, index) {
    return index + 1
  })

  function goTo(page) {
    if (page < 1 || page > totalPages || page === currentPage) return
    onPageChange(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={function () {
          goTo(currentPage - 1)
        }}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`${baseButton} border-gray-200 bg-white text-gray-600 hover:border-green-600 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600`}
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>

      {pages.map(function (page) {
        const isActive = page === currentPage
        return (
          <button
            key={page}
            type="button"
            onClick={function () {
              goTo(page)
            }}
            aria-current={isActive ? 'page' : undefined}
            className={`${baseButton} ${
              isActive
                ? 'border-green-600 bg-green-600 text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-green-600 hover:text-green-600'
            }`}
          >
            {page}
          </button>
        )
      })}

      <button
        type="button"
        onClick={function () {
          goTo(currentPage + 1)
        }}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={`${baseButton} border-gray-200 bg-white text-gray-600 hover:border-green-600 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600`}
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </nav>
  )
}
