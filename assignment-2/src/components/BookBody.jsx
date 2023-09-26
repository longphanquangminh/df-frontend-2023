import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BookButton from "./BookButton";
import BookInput from "./BookInput";
import BookModal from "./BookModal";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/baseUrl";
import { useStoreActions, useStoreState } from "easy-peasy";
import removeExtraSpaces from "../utils/removeExtraSpaces";
import convertAccentedVietnamese from "../utils/convertAccentedVietnamese";

export default function BookBody() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [bookData, setBookData] = useState([]);
  const [chosenDeleteBookId, setChosenDeleteBookId] = useState(0);
  const [chosenDeleteBookName, setChosenDeleteBookName] = useState("");
  const beautifulTableClass = "border-2 border-[#c5cfd9] p-2";
  const searchValue = useStoreState(actions => actions.searchValue);
  const dataChanged = useStoreState(state => state.dataChanged);
  const editSearchValue = useStoreActions(actions => actions.editSearchValue);
  const changeDataChanged = useStoreActions(actions => actions.changeDataChanged);
  useEffect(() => {
    axios
      .get(BASE_URL)
      .then(res => setBookData([...res.data]))
      .catch(err => console.err(err));
  }, [dataChanged]);
  const resetChosenBook = () => {
    setChosenDeleteBookId(0);
    setChosenDeleteBookName("");
    changeDataChanged(!dataChanged);
  };
  const handleAskDelete = (id, name) => {
    setOpenDeleteModal(true);
    setChosenDeleteBookId(id);
    setChosenDeleteBookName(name);
  };
  const handleConfirmDelete = () => {
    axios
      .delete(`${BASE_URL}/${chosenDeleteBookId}`)
      .then(res => {
        console.log(res);
        resetChosenBook();
      })
      .catch(err => console.err(err));
  };
  return (
    <>
      <div className='p-3 space-y-12'>
        <div className='grid grid-cols-1 md:flex gap-3 justify-between items-center'>
          <BookInput onChange={e => editSearchValue(e.target.value)} placeholder='Search books' icon={<FontAwesomeIcon icon={faSearch} />} />
          <BookButton onClick={() => setOpenAddModal(true)}>Add book</BookButton>
        </div>
        {bookData.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse text-left bg-white'>
              <thead>
                <tr>
                  <th className={beautifulTableClass}>Name</th>
                  <th className={beautifulTableClass}>Author</th>
                  <th className={beautifulTableClass}>Topic</th>
                  <th className={beautifulTableClass}>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookData
                  .filter(item => {
                    const userSearch = removeExtraSpaces(convertAccentedVietnamese(searchValue.toLowerCase()));
                    return (
                      item.name.toLowerCase().includes(userSearch) ||
                      item.author.toLowerCase().includes(userSearch) ||
                      item.topic.toLowerCase().includes(userSearch)
                    );
                  })
                  .map((item, index) => (
                    <tr className='bg-white hover:bg-[#f7f8fa] duration-300' key={index}>
                      <td className={beautifulTableClass}>{item.name}</td>
                      <td className={beautifulTableClass}>{item.author}</td>
                      <td className={beautifulTableClass}>{item.topic}</td>
                      <td className={beautifulTableClass}>
                        <button
                          onClick={() => handleAskDelete(item.id, item.name)}
                          className='underline text-[#d2455b] hover:text-[#FF5571] duration-300'
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div></div>
          </div>
        ) : (
          <p className='text-center'>There are no books available!</p>
        )}
      </div>
      {openDeleteModal && (
        <BookModal deleteBook={[chosenDeleteBookId, chosenDeleteBookName, handleConfirmDelete]} onClose={() => setOpenDeleteModal(false)} />
      )}
      {openAddModal && <BookModal onClose={() => setOpenAddModal(false)} />}
    </>
  );
}
