'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { URL_BOOKS } from '../../constants/url';
import IBook from '../../interfaces/IBook';
import BookButtonText from '../../components/BookButtonText';
import BookModal from '../../components/BookModal';
import { useAppContext } from '../../context/AppContext';
import { loadingTimeout } from '../../constants/variables';
import { https } from '../../api/user/config';

export default function BookViewPage() {
  const { id } = useParams();
  const [viewBookData, setViewBookData] = useState<IBook>();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [chosenDeleteBookId, setChosenDeleteBookId] = useState(0);
  const [chosenDeleteBookName, setChosenDeleteBookName] = useState('');
  const router = useRouter();
  const handleAskDelete = (id: number, name: string) => {
    setOpenDeleteModal(true);
    setChosenDeleteBookId(id);
    setChosenDeleteBookName(name);
  };
  useEffect(() => {
    https
      .get(`${URL_BOOKS}/${id}`)
      .then((res) => {
        setViewBookData(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        router.replace('/not-found');
      });
  }, [id, router]);
  const { editLoadingTrue, editLoadingFalse } = useAppContext();
  const handleConfirmDelete = () => {
    editLoadingTrue();
    https
      .delete(`${URL_BOOKS}/${chosenDeleteBookId}`)
      .then(() => {
        router.replace('/');
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    setTimeout(() => {
      editLoadingFalse();
    }, loadingTimeout);
  });
  return (
    <>
      <div className="p-3">
        {viewBookData ? (
          <div className="space-y-6">
            <p>
              <Link
                className="text-[#d2455b] hover:text-[#FF5571] duration-300"
                href="/"
              >
                <span className="flex items-center">
                  <span className="mr-1">
                    <ChevronLeft />
                  </span>
                  <span>Back</span>
                </span>
              </Link>
            </p>
            <h1 className="text-3xl font-bold">{viewBookData.name}</h1>
            <div>
              <p>
                <span className="font-bold">Author: </span>
                <span>{viewBookData.author}</span>
              </p>
              <p>
                <span className="font-bold">Topic: </span>
                <span>{viewBookData.topic.name}</span>
              </p>
            </div>
            <div>
              <BookButtonText
                title={`Delete ${viewBookData.name} book`}
                onClick={() => {
                  handleAskDelete(viewBookData.id, viewBookData.name);
                }}
              >
                Delete
              </BookButtonText>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
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
    </>
  );
}
