import { Search } from 'lucide-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import BookButton from './BookButton';
import BookInput from './BookInput';
import BookModal from './BookModal';
import { BASE_URL } from '../constants/baseUrl';
import removeExtraSpaces from '../utils/removeExtraSpaces';
import convertAccentedVietnamese from '../utils/convertAccentedVietnamese';
import IBook from '../interfaces/IBook';
import Pagination from './Pagination';
import { useAppContext } from '../context/AppContext';
import BookButtonText from './BookButtonText';
import BookButtonLink from './BookButtonLink';
import { BOOK_TYPES } from 'app/constants/bookTypes';

export default function BookBody() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [bookData, setBookData] = useState<IBook[]>([]);
  const [chosenBookId, setChosenBookId] = useState(0);
  const [chosenBookData, setChosenBookData] = useState({
    id: 0,
    name: '',
    author: '',
    topic: BOOK_TYPES[0],
  });
  const [chosenDeleteBookName, setChosenDeleteBookName] = useState('');
  const beautifulTableClass = 'border-2 border-[#c5cfd9] p-2';
  const {
    dataChanged,
    searchValue,
    currentPage,
    editCurrentPage,
    editSearchValue,
    changeDataChanged,
    editLoadingTrue,
    editLoadingFalse,
    putInfoToInputs,
  } = useAppContext();
  const itemsPerPage = 5;
  const handlePageChange = (newPage: number) => {
    editCurrentPage(newPage);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  useEffect(() => {
    editLoadingTrue();
    axios
      .get(BASE_URL)
      .then((res) => {
        setBookData([...res.data]);
        editLoadingFalse();
      })
      .catch((err) => {
        console.error(err);
        editLoadingFalse();
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
    editLoadingTrue();
    axios
      .get(`${BASE_URL}/${id}`)
      .then((res) => {
        setChosenBookData(res.data);
        putInfoToInputs(res.data);
        editLoadingFalse();
      })
      .catch((err) => {
        console.error(err);
        editLoadingFalse();
      });
    setOpenEditModal(true);
  };
  const handleConfirmDelete = () => {
    editLoadingTrue();
    axios
      .delete(`${BASE_URL}/${chosenBookId}`)
      .then(() => {
        resetChosenBook();
      })
      .catch((err) => {
        console.error(err);
        editLoadingFalse();
      });
  };
  const bookDataAfterFilter = [
    ...bookData.filter((item: IBook) => {
      const userSearch = removeExtraSpaces(
        convertAccentedVietnamese(searchValue.toLowerCase())
      );
      return (
        convertAccentedVietnamese(item.name.toLowerCase()).includes(
          userSearch
        ) ||
        convertAccentedVietnamese(item.author.toLowerCase()).includes(
          userSearch
        ) ||
        convertAccentedVietnamese(item.topic.toLowerCase()).includes(userSearch)
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
                    .map((item: IBook, index) => (
                      <tr
                        className="bg-white hover:bg-[#f7f8fa] duration-300"
                        key={index}
                      >
                        <td className={beautifulTableClass}>{item.name}</td>
                        <td className={beautifulTableClass}>{item.author}</td>
                        <td className={beautifulTableClass}>{item.topic}</td>
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
          <p className="text-center">There are no books available!</p>
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
