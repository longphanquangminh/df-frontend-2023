'use client'

import axios from 'axios'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BASE_URL } from '../../constants/baseUrl'
import IBook from '../../interfaces/IBook'
import BookButtonText from '../../components/BookButtonText'
import BookModal from '../../components/BookModal'

export default function BookViewPage() {
  const { id } = useParams()
  const [viewBookData, setViewBookData] = useState<IBook>()
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [chosenDeleteBookId, setChosenDeleteBookId] = useState(0)
  const [chosenDeleteBookName, setChosenDeleteBookName] = useState('')
  const router = useRouter()
  const handleAskDelete = (id, name) => {
    setOpenDeleteModal(true)
    setChosenDeleteBookId(id)
    setChosenDeleteBookName(name)
  }
  useEffect(() => {
    axios
      .get(`${BASE_URL}/${id}`)
      .then((res) => {
        setViewBookData(res.data)
      })
      .catch((err) => {
        console.error(err)
        router.replace('/error')
      })
  }, [id, router])
  const handleConfirmDelete = () => {
    axios
      .delete(`${BASE_URL}/${chosenDeleteBookId}`)
      .then(() => {
        router.replace('/')
      })
      .catch((err) => {
        console.error(err)
      })
  }
  return (
    <>
      <div>
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
                <span>{viewBookData.topic}</span>
              </p>
            </div>
            <div>
              <BookButtonText
                title={`Delete ${viewBookData.name} book`}
                onClick={() => {
                  handleAskDelete(viewBookData.id, viewBookData.name)
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
  )
}
