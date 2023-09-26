import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import { RemoveScrollBar } from "react-remove-scroll-bar";
import BookButton from "./BookButton";
import BookInput from "./BookInput";
import { BOOK_TYPES } from "../constants/bookTypes";

function BookModal(props) {
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
                <BookInput />
              </div>
              <div>
                <label>Author</label>
                <BookInput />
              </div>
              <div>
                <label>Topic</label>
                <BookInput selectOptionValues={BOOK_TYPES} />
              </div>
              <div className='flex justify-end'>
                <BookButton>Create</BookButton>
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
