import { useEffect, useRef, useState } from 'react';
import { RemoveScrollBar } from 'react-remove-scroll-bar';
import { X } from 'lucide-react';
import BookButton from './BookButton';
import BookInput from './BookInput';
import { URL_BOOKS } from '../constants/url';
import { useAppContext } from '../context/AppContext';
import removeExtraSpaces from '../utils/removeExtraSpaces';
import { lettersSpacesRegex } from '../regex/lettersSpacesRegex';
import { https } from '../api/user/config';
import { Book } from '../api/generated/orval';

type Props = {
  onClose: () => void;
  className?: string;
  deleteBook?: [string | number, string, () => void];
  isEdit?: boolean;
  chosenBookData?: Book;
};

export default function BookModal(props: Props) {
  const [checkWrongName, setCheckWrongName] = useState(false);
  const [checkWrongAuthor, setCheckWrongAuthor] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !(modalRef.current as HTMLElement).contains(e.target as Node)
      ) {
        props.onClose();
        resetInputValue();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        props.onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleDeleteBook = () => {
    if (props.deleteBook && props.deleteBook.length > 0) {
      props.deleteBook[2]();
    }
    props.onClose();
  };

  const {
    appSummaryInfo,
    editInputValue,
    resetInputValue,
    dataChanged,
    updateInfo,
    bookTopics,
    changeDataChanged,
    editLoadingTrue,
    editLoadingFalse,
  } = useAppContext();

  const handleEditBook = () => {
    const notGoodName = !(
      removeExtraSpaces(updateInfo.addBookName).length >= 5
    );
    const notGoodAuthor = !lettersSpacesRegex.test(updateInfo.addBookAuthor);
    if (notGoodName || notGoodAuthor) {
      setCheckWrongName(notGoodName);
      setCheckWrongAuthor(notGoodAuthor);
    } else {
      props.onClose();
      editLoadingTrue();
      https({
        url: `${URL_BOOKS}/${props.chosenBookData?.id}`,
        method: 'PUT',
        data: {
          name: updateInfo.addBookName,
          author: updateInfo.addBookAuthor,
          topicId: Number(updateInfo.addBookTopic),
        },
      })
        .then(() => {
          resetInputValue();
          changeDataChanged(!dataChanged);
        })
        .catch((err) => {
          console.error(err);
          editLoadingFalse();
        });
    }
  };
  const handleAddBook = () => {
    const notGoodName = !(
      removeExtraSpaces(appSummaryInfo.addBookName).length >= 5
    );
    const notGoodAuthor = !lettersSpacesRegex.test(
      appSummaryInfo.addBookAuthor
    );
    if (notGoodName || notGoodAuthor) {
      setCheckWrongName(notGoodName);
      setCheckWrongAuthor(notGoodAuthor);
    } else {
      props.onClose();
      editLoadingTrue();
      https({
        url: URL_BOOKS,
        method: 'POST',
        data: {
          name: appSummaryInfo.addBookName,
          author: appSummaryInfo.addBookAuthor,
          topicId: Number(appSummaryInfo.addBookTopic),
        },
      })
        .then(() => {
          resetInputValue();
          changeDataChanged(!dataChanged);
        })
        .catch((err) => {
          console.error(err);
          editLoadingFalse();
        });
    }
  };

  const handleChangeNewBookName = (value: string) => {
    editInputValue('addBookName', value);
    setCheckWrongName(removeExtraSpaces(value).length < 5);
  };

  const handleChangeNewBookAuthor = (value: string) => {
    editInputValue('addBookAuthor', value);
    setCheckWrongAuthor(!lettersSpacesRegex.test(removeExtraSpaces(value)));
  };

  return (
    <div
      className={`fixed left-0 top-0 z-40 h-screen w-screen bg-neutral-900 bg-opacity-75 flex items-center justify-center overflow-y-auto duration-300 ${props.className}`}
    >
      <RemoveScrollBar />
      <div
        className="w-fit md:w-2/5 bg-white p-10 border-4 border-[#c5cfd9]"
        ref={modalRef}
      >
        {!props.deleteBook ? (
          <>
            <div className="flex justify-between mb-6">
              <div className="font-bold text-xl">
                {props.isEdit ? 'Edit' : 'Add'} book
              </div>
              <X
                onClick={props.onClose}
                className="cursor-pointer text-gray-500 text-sm hover:text-black duration-300"
              />
            </div>
            <div className="space-y-6">
              <div>
                <BookInput
                  label="Name"
                  name="bookName"
                  value={
                    props.isEdit
                      ? updateInfo.addBookName
                      : appSummaryInfo.addBookName
                  }
                  onChange={(
                    e:
                      | React.ChangeEvent<HTMLInputElement>
                      | React.ChangeEvent<HTMLSelectElement>
                  ) => handleChangeNewBookName(e.target.value)}
                />
                {checkWrongName && (
                  <span className="text-red-500 font-sm">
                    Book name: Minimum of 5 characters, required.
                  </span>
                )}
              </div>
              <div>
                <BookInput
                  label="Author"
                  name="bookAuthor"
                  value={
                    props.isEdit
                      ? updateInfo.addBookAuthor
                      : appSummaryInfo.addBookAuthor
                  }
                  onChange={(
                    e:
                      | React.ChangeEvent<HTMLInputElement>
                      | React.ChangeEvent<HTMLSelectElement>
                  ) => handleChangeNewBookAuthor(e.target.value)}
                />
                {checkWrongAuthor && (
                  <span className="text-red-500 font-sm">
                    Author name: Only letters and spaces, required.
                  </span>
                )}
              </div>
              <div>
                <BookInput
                  label="Topic"
                  name="bookTopic"
                  value={
                    props.isEdit
                      ? updateInfo.addBookTopic
                      : appSummaryInfo.addBookTopic
                  }
                  onChange={(
                    e:
                      | React.ChangeEvent<HTMLInputElement>
                      | React.ChangeEvent<HTMLSelectElement>
                  ) => editInputValue('addBookTopic', e.target.value)}
                  selectOptionValues={bookTopics}
                />
              </div>
              <div className="flex justify-end">
                <BookButton
                  onClick={() => {
                    if (props.isEdit) {
                      handleEditBook();
                    } else {
                      handleAddBook();
                    }
                  }}
                >
                  {props.isEdit ? 'Edit' : 'Create'}
                </BookButton>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between mb-6">
              <div>{}</div>
              <div className="font-bold text-xl">Delete book</div>
              <X
                onClick={props.onClose}
                className="cursor-pointer text-gray-500 text-sm hover:text-black duration-300"
              />
            </div>
            <div className="space-y-6">
              <p className="text-center">
                Do you want to delete{' '}
                <span className="font-bold">{props.deleteBook[1]}</span> book?
              </p>
              <div className="flex justify-center gap-x-12">
                <BookButton onClick={() => handleDeleteBook()} isNegative>
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
