import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { RemoveScrollBar } from "react-remove-scroll-bar";
import BookButton from "./BookButton";
import BookInput from "./BookInput";
import { BOOK_TYPES } from "../constants/bookTypes";
import { useStoreActions, useStoreState } from "easy-peasy";
import axios from "axios";
import { BASE_URL } from "../constants/baseUrl";

function BookModal(props) {
  const [checkWrongName, setCheckWrongName] = useState(false);
  const [checkWrongAuthor, setCheckWrongAuthor] = useState(false);
  const modalRef = useRef(null);
  const handleClickOutside = e => {
    if (modalRef.current && !modalRef.current.contains(e.target)) props.onClose();
  };
  useEffect(() => {
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  });
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === "Escape") {
        props.onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });
  const handleDeleteBook = () => {
    props.deleteBook[2]();
    props.onClose();
  };
  const addBookName = useStoreState(state => state.addBookName);
  const addBookAuthor = useStoreState(state => state.addBookAuthor);
  const addBookTopic = useStoreState(state => state.addBookTopic);
  const dataChanged = useStoreState(state => state.dataChanged);
  const changeAddBookName = useStoreActions(actions => actions.changeAddBookName);
  const changeAddBookAuthor = useStoreActions(actions => actions.changeAddBookAuthor);
  const changeAddBookTopic = useStoreActions(actions => actions.changeAddBookTopic);
  const changeDataChanged = useStoreActions(actions => actions.changeDataChanged);
  const handleAddBook = () => {
    if (addBookName.length === 0 || addBookAuthor.length === 0) {
      if (addBookName.length === 0) {
        setCheckWrongName(true);
      } else {
        setCheckWrongName(false);
      }
      if (addBookAuthor.length === 0) {
        setCheckWrongAuthor(true);
      } else {
        setCheckWrongAuthor(false);
      }
    } else {
      axios({
        url: BASE_URL,
        method: "POST",
        data: {
          name: addBookName,
          author: addBookAuthor,
          topic: addBookTopic,
        },
      })
        .then(res => {
          console.log(res);
          props.onClose();
          changeAddBookName("");
          changeAddBookAuthor("");
          changeAddBookTopic(BOOK_TYPES[0]);
          changeDataChanged(!dataChanged);
        })
        .catch(err => console.err(err));
    }
  };
  const handleChangeNewBookName = string => {
    changeAddBookName(string);
    if (string.length === 0) {
      setCheckWrongName(true);
    } else {
      setCheckWrongName(false);
    }
  };
  const handleChangeNewBookAuthor = string => {
    changeAddBookAuthor(string);
    if (string.length === 0) {
      setCheckWrongAuthor(true);
    } else {
      setCheckWrongAuthor(false);
    }
  };
  return (
    <div
      className={`fixed left-0 top-0 z-50 h-screen w-screen bg-neutral-900 bg-opacity-75 flex items-center justify-center overflow-y-auto duration-300 ${props.className}`}
    >
      <RemoveScrollBar />
      <div className='w-fit md:w-2/5 bg-white p-10 border-4 border-[#c5cfd9]' ref={modalRef}>
        {!props.deleteBook ? (
          <>
            <div className='flex justify-between mb-6'>
              <div className='font-bold text-xl'>Add book</div>
              <FontAwesomeIcon onClick={props.onClose} className='cursor-pointer text-gray-500 text-sm hover:text-black duration-300' icon={faX} />
            </div>
            <div className='space-y-6'>
              <div>
                <label>Name</label>
                <BookInput value={addBookName} onChange={e => handleChangeNewBookName(e.target.value)} />
                {checkWrongName && <span className='text-red-500 font-sm'>Name cannot be empty!</span>}
              </div>
              <div>
                <label>Author</label>
                <BookInput value={addBookAuthor} onChange={e => handleChangeNewBookAuthor(e.target.value)} />
                {checkWrongAuthor && <span className='text-red-500 font-sm'>Author cannot be empty!</span>}
              </div>
              <div>
                <label>Topic</label>
                <BookInput value={addBookTopic} onChange={e => changeAddBookTopic(e.target.value)} selectOptionValues={BOOK_TYPES} />
              </div>
              <div className='flex justify-end'>
                <BookButton onClick={handleAddBook}>Create</BookButton>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='flex justify-between mb-6'>
              <div></div>
              <div className='font-bold text-xl'>Delete book</div>
              <FontAwesomeIcon onClick={props.onClose} className='cursor-pointer text-gray-500 text-sm hover:text-black duration-300' icon={faX} />
            </div>
            <div className='space-y-6'>
              <p className='text-center'>
                Do you want to delete <span className='font-bold'>{props.deleteBook[1]}</span> book?
              </p>
              <div className='flex justify-center gap-x-12'>
                <BookButton onClick={() => handleDeleteBook(props.deleteBook[0])} isNegative>
                  Delete
                </BookButton>
                <BookButton onClick={props.onClose}>Cancel</BookButton>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BookModal;
