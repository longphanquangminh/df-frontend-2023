'use client'

import Link from 'next/link'
import { UserCircle2 } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function BookHeader() {
  const { isLightMode, changeLightDarkMode } = useAppContext()
  const flexCenterAll =
    'flex md:flex gap-3 md:justify-between items-center place-self-center'
  return (
    <div
      className={`${flexCenterAll} p-3 text-xl ${
        isLightMode ? 'bg-white' : 'bg-black'
      } duration-300 grid border-b-2 border-[#c5cfd9]`}
    >
      <h1
        className={`capitalize font-bold text-3xl ${flexCenterAll} ${
          !isLightMode && 'text-white'
        } duration-300`}
      >
        <Link href="/">bookstore</Link>
      </h1>
      <div className={`${flexCenterAll} grid gap-x-12`}>
        <div className={flexCenterAll}>
          <button
            title="lightDarkButton"
            onClick={() => changeLightDarkMode(!isLightMode)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                changeLightDarkMode(!isLightMode)
              }
            }}
            className={`cursor-pointer rounded-full ${
              isLightMode ? `bg-pink-600` : `bg-gray-500`
            } duration-300 w-16 h-8 relative`}
          >
            <div
              className={`rounded-full absolute bg-white w-7 h-7 top-0.5 ${
                isLightMode ? `left-[53%]` : `left-0.5`
              } duration-300`}
            >
              {}
            </div>
          </button>
          <div
            className={`text-right w-28 ${
              !isLightMode && 'text-white'
            } duration-300`}
          >
            {isLightMode ? 'Light' : 'Dark'} mode
          </div>
        </div>
        <div
          className={`${flexCenterAll} ${
            !isLightMode && 'text-white'
          } duration-300`}
        >
          <UserCircle2 />
          Long Phan
        </div>
      </div>
    </div>
  )
}
