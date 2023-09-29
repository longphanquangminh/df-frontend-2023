import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useEffect, useState } from 'react'
import BookButton from './BookButton'
import BookInput from './BookInput'
import BookModal from './BookModal'
import { BASE_URL } from '../constants/baseUrl'
import removeExtraSpaces from '../utils/removeExtraSpaces'
import convertAccentedVietnamese from '../utils/convertAccentedVietnamese'
import IBook from '../interfaces/IBook'
import Pagination from './Pagination'
import { useAppContext } from '../context/AppContext'

export default function BookBody() {
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [bookData, setBookData] = useState<IBook[]>([])
  const [chosenDeleteBookId, setChosenDeleteBookId] = useState(0)
  const [chosenDeleteBookName, setChosenDeleteBookName] = useState('')
  const beautifulTableClass = 'border-2 border-[#c5cfd9] p-2'
  const a = "a"
  const { appSummaryInfo, dataChanged, editInputValue, changeDataChanged } =
    useAppContext()
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 5
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  useEffect(() => {
    axios
      .get(BASE_URL)
      .then((res) => {
        setBookData([...res.data])
        setLoading(false)
      })
      .catch((err) => {
        alert(err)
        setLoading(false)
      })
  }, [dataChanged])

  const resetChosenBook = () => {
    setChosenDeleteBookId(0)
    setChosenDeleteBookName('')
    changeDataChanged(!dataChanged)
  }
  const handleAskDelete = (id, name) => {
    setOpenDeleteModal(true)
    setChosenDeleteBookId(id)
    setChosenDeleteBookName(name)
  }
  const handleConfirmDelete = () => {
    axios
      .delete(`${BASE_URL}/${chosenDeleteBookId}`)
      .then(() => {
        resetChosenBook()
      })
      .catch((err) => alert(err))
  }
  const bookDataAfterFilter = [
    ...bookData.filter((item: IBook) => {
      const userSearch = removeExtraSpaces(
        convertAccentedVietnamese(appSummaryInfo.searchValue.toLowerCase()),
      )
      return (
        convertAccentedVietnamese(item.name.toLowerCase()).includes(
          userSearch,
        ) ||
        convertAccentedVietnamese(item.author.toLowerCase()).includes(
          userSearch,
        ) ||
        convertAccentedVietnamese(item.topic.toLowerCase()).includes(userSearch)
      )
    }),
  ]
  useEffect(() => {
    if (
      currentPage > 1 &&
      currentPage > Math.ceil(bookDataAfterFilter.length / itemsPerPage)
    ) {
      setCurrentPage(currentPage - 1)
    }
  }, [bookDataAfterFilter.length, currentPage])
  return (
    <>
      <div className="p-3 space-y-12">
        <div className="grid grid-cols-1 md:flex gap-3 justify-between items-center">
          <BookInput
            onChange={(e) => editInputValue('searchValue', e.target.value)}
            placeholder="Search books"
            name="searchBooks"
            icon={<FontAwesomeIcon icon={faSearch} />}
          />
          <BookButton onClick={() => setOpenAddModal(true)}>
            Add book
          </BookButton>
        </div>
        {bookDataAfterFilter.length > 0 ? (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left bg-white">
                <thead>
                  <tr>
                    <th className={beautifulTableClass}>Name</th>
                    <th className={beautifulTableClass}>Author</th>
                    <th className={beautifulTableClass}>Topic</th>
                    <th className={beautifulTableClass}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookDataAfterFilter
                    .slice(startIndex, endIndex)
                    .map((item: IBook, index) => (
                      <tr
                        className="bg-white hover:bg-[#f7f8fa] duration-300"
                        key={index}
                      >
                        <td className={beautifulTableClass}>{item.name}</td>
                        <td className={beautifulTableClass}>{item.author}</td>
                        <td className={beautifulTableClass}>{item.topic}</td>
                        <td className={beautifulTableClass}>
                          <button
                            onClick={() => handleAskDelete(item.id, item.name)}
                            className="underline text-[#d2455b] hover:text-[#FF5571] duration-300"
                            title="Delete"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalLength={bookDataAfterFilter.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <p className="text-center">
            {loading ? 'Loading...' : 'There are no books available!'}
          </p>
        )}
      </div>
      {openDeleteModal && (
        <BookModal
          deleteBook={[
            chosenDeleteBookId,
            chosenDeleteBookName,
            handleConfirmDelete,
          ]}
          onClose={() => setOpenDeleteModal(false)}
        />
      )}
      {openAddModal && <BookModal onClose={() => setOpenAddModal(false)} />}
    </>
  )
}
