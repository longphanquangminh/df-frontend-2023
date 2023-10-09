'use client';

import BookButton from 'app/components/BookButton';
import BookInput from 'app/components/BookInput';
import { emailRegex } from 'app/regex/emailRegex';
import { passwordRegex } from 'app/regex/passwordRegex';
import convertAccentedVietnamese from 'app/utils/convertAccentedVietnamese';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [isGoodLoginEmail, setIsGoodLoginEmail] = useState(false);
  const [isGoodLoginPassword, setIsGoodLoginPassword] = useState(false);
  const handleCheckEmail = (value: string) => {
    if (emailRegex.test(value)) {
      setIsGoodLoginEmail(true);
    } else {
      setIsGoodLoginEmail(false);
    }
  };
  const handleCheckPassword = (value: string) => {
    if (passwordRegex.test(convertAccentedVietnamese(value))) {
      setIsGoodLoginPassword(true);
    } else {
      setIsGoodLoginPassword(false);
    }
  };
  const router = useRouter();
  return (
    <div className="flex flex-1 justify-center items-center">
      <div className="m-6 w-96 bg-white border-2 border-[#c5cfd9] py-6 px-3 space-y-9">
        <h1 className="text-3xl font-bold text-[#d2455b] text-center">
          Bookstore
        </h1>
        <BookInput
          required
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          onChange={(
            e:
              | React.ChangeEvent<HTMLInputElement>
              | React.ChangeEvent<HTMLSelectElement>
          ) => handleCheckEmail(e.target.value)}
        />
        <BookInput
          required
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          seePasswordOption
          onChange={(
            e:
              | React.ChangeEvent<HTMLInputElement>
              | React.ChangeEvent<HTMLSelectElement>
          ) => handleCheckPassword(e.target.value)}
        />
        <BookButton
          disabled={!isGoodLoginPassword || !isGoodLoginEmail}
          className="w-full"
          onClick={() => {
            alert('Login successfully!');
            router.replace('/');
          }}
        >
          Login
        </BookButton>
      </div>
    </div>
  );
}
