import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import BookButton from './BookButton';
import BookInput from './BookInput';
import BookModal from './BookModal';
import { URL_BOOKS } from '../constants/url';
import removeExtraSpaces from '../utils/removeExtraSpaces';
import convertAccentedVietnamese from '../utils/convertAccentedVietnamese';
import Pagination from './Pagination';
import { useAppContext } from '../context/AppContext';
import BookButtonText from './BookButtonText';
import BookButtonLink from './BookButtonLink';
import { defaultBookData } from '../constants/defaultValues';
import { https } from '../api/user/config';
import { Book } from '../api/generated/orval';

export default function BookBody() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [bookData, setBookData] = useState<Book[]>([]);
  const [chosenBookId, setChosenBookId] = useState(0);
  const [chosenBookData, setChosenBookData] = useState({ ...defaultBookData });
  const [chosenDeleteBookName, setChosenDeleteBookName] = useState('');
  const beautifulTableClass = 'border-2 border-[#c5cfd9] p-2';
  const {
    dataChanged,
    searchValue,
    currentPage,
    editCurrentPage,
    editSearchValue,
    changeDataChanged,
    putInfoToInputs,
  } = useAppContext();
  const itemsPerPage = 5;
  const handlePageChange = (newPage: number) => {
    editCurrentPage(newPage);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  useEffect(() => {
    https
      .get(URL_BOOKS)
      .then((res) => {
        setBookData([...res.data.data]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [dataChanged]);

  const resetChosenBook = () => {
    setChosenBookId(0);
    setChosenDeleteBookName('');
    changeDataChanged(!dataChanged);
  };
  const handleAskDelete = (id: number, name: string) => {
    setOpenDeleteModal(true);
    setChosenBookId(id);
    setChosenDeleteBookName(name);
  };
  const handleEditBook = (id: number) => {
    https
      .get(`${URL_BOOKS}/${id}`)
      .then((res) => {
        setChosenBookData(res.data.data);
        putInfoToInputs(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
    setOpenEditModal(true);
  };
  const handleConfirmDelete = () => {
    https
      .delete(`${URL_BOOKS}/${chosenBookId}`)
      .then(() => {
        resetChosenBook();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const bookDataAfterFilter = [
    ...bookData.filter((item: Book) => {
      const userSearch = removeExtraSpaces(
        convertAccentedVietnamese(searchValue.toLowerCase())
      );
      return (
        convertAccentedVietnamese(item.name.toLowerCase()).includes(
          userSearch
        ) ||
        convertAccentedVietnamese(item?.author ?? '')
          .toLowerCase()
          .includes(userSearch) ||
        convertAccentedVietnamese(item?.topic?.name ?? '')
          .toLowerCase()
          .includes(userSearch)
      );
    }),
  ];
  useEffect(() => {
    if (
      currentPage > 1 &&
      currentPage > Math.ceil(bookDataAfterFilter.length / itemsPerPage)
    ) {
      editCurrentPage(currentPage - 1);
    }
  });
  return (
    <>
      <div className="space-y-12 p-3">
        <div className="grid grid-cols-1 md:flex gap-3 justify-between items-center">
          <BookInput
            onChange={(
              e:
                | React.ChangeEvent<HTMLInputElement>
                | React.ChangeEvent<HTMLSelectElement>
            ) => editSearchValue(e.target.value)}
            placeholder="Search books"
            name="searchBooks"
            icon={<Search />}
            value={searchValue}
          />
          <BookButton onClick={() => setOpenAddModal(true)}>
            Add book
          </BookButton>
        </div>
        {bookDataAfterFilter.length > 0 ? (
          <div>
            <div className="overflow-x-auto h-72">
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
                    .map((item: Book, index) => (
                      <tr
                        className="bg-white hover:bg-[#f7f8fa] duration-300"
                        key={index}
                      >
                        <td className={beautifulTableClass}>{item.name}</td>
                        <td className={beautifulTableClass}>{item.author}</td>
                        <td className={beautifulTableClass}>
                          {item.topic?.name || 'No topic'}
                        </td>
                        <td className={beautifulTableClass}>
                          <div className="flex gap-x-2">
                            <BookButtonText
                              title={`Delete book #${item.id}`}
                              onClick={() => handleEditBook(item.id)}
                            >
                              Edit
                            </BookButtonText>
                            <span className="text-[#d2455b] font-bold">
                              {' | '}
                            </span>
                            <BookButtonText
                              title={`Delete book #${item.id}`}
                              onClick={() =>
                                handleAskDelete(item.id, item.name)
                              }
                            >
                              Delete
                            </BookButtonText>
                            <span className="text-[#d2455b] font-bold">
                              {' | '}
                            </span>
                            <BookButtonLink href={`/book/${item.id}`}>
                              View
                            </BookButtonLink>
                          </div>
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
            There are no books available! Try to add, refresh, delete search
            input or login!
          </p>
        )}
      </div>
      {openDeleteModal && (
        <BookModal
          deleteBook={[chosenBookId, chosenDeleteBookName, handleConfirmDelete]}
          onClose={() => setOpenDeleteModal(false)}
        />
      )}
      {openAddModal && <BookModal onClose={() => setOpenAddModal(false)} />}
      {openEditModal && (
        <BookModal
          isEdit
          chosenBookData={chosenBookData}
          onClose={() => setOpenEditModal(false)}
        />
      )}
    </>
  );
}
