'use client'

import axios from 'axios'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BASE_URL } from '../../constants/baseUrl'
import { AppContextProvider } from '../../context/AppContext'
import BookHeader from '../../components/BookHeader'
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
      })
  }, [id])
  const handleConfirmDelete = () => {
    axios
      .delete(`${BASE_URL}/${chosenDeleteBookId}`)
      .then(() => {
        router.replace('/')
      })
      .catch((err) => console.error(err))
  }
  if (!viewBookData) return <p>Not found</p>
  return (
    <AppContextProvider>
      <div className="flex flex-col min-h-screen bg-[#f7f8fa]">
        <div>
          <BookHeader />
        </div>
        <div className="flex-1">
          <div className="space-y-6 p-3">
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
        </div>
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
    </AppContextProvider>
  )
}
