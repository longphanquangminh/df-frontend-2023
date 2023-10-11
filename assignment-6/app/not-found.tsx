'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useAppContext } from './context/AppContext';

export default function NotFound() {
  const { editLoadingFalse } = useAppContext();
  useEffect(() => {
    editLoadingFalse();
  });
  return (
    <div className="flex flex-1 justify-center items-center">
      <div className="text-center font-bold space-y-6">
        <h1 className="text-8xl select-none">404</h1>
        <p>Page not found</p>
        <p>
          <Link
            className="text-[#d2455b] hover:text-[#FF5571] duration-300"
            href="/"
          >
            <span className="flex items-center">
              <span className="mr-1">
                <ChevronLeft />
              </span>
              <span>Back to home page</span>
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
