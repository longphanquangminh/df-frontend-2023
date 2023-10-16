'use client';

import PasswordStrengthBar from 'react-password-strength-bar-with-style-item';
import BookButton from 'app/components/BookButton';
import BookInput from 'app/components/BookInput';
import { emailRegex } from 'app/regex/emailRegex';
import { passwordRegex } from 'app/regex/passwordRegex';
import convertAccentedVietnamese from 'app/utils/convertAccentedVietnamese';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [isGoodRegisterEmail, setIsGoodRegisterEmail] = useState(false);
  const [isGoodRegisterPassword, setIsGoodRegisterPassword] = useState(false);
  const [isGoodRegisterConfirmPassword, setIsGoodRegisterConfirmPassword] =
    useState(false);
  const [password, checkPassword] = useState('');
  const [confirmPassword, checkConfirmPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const handleCheckEmail = (value: string) => {
    if (emailRegex.test(value)) {
      setIsGoodRegisterEmail(true);
    } else {
      setIsGoodRegisterEmail(false);
    }
  };
  const handleCheckPassword = (value: string) => {
    checkPassword(value);
    if (passwordRegex.test(convertAccentedVietnamese(value))) {
      setIsGoodRegisterPassword(true);
    } else {
      setIsGoodRegisterPassword(false);
    }
    if (confirmPassword === value) {
      setIsGoodRegisterConfirmPassword(true);
    } else {
      setIsGoodRegisterConfirmPassword(false);
    }
  };
  const handleCheckConfirmPassword = (value: string) => {
    checkConfirmPassword(value);
    if (password === value) {
      setIsGoodRegisterConfirmPassword(true);
    } else {
      setIsGoodRegisterConfirmPassword(false);
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
          required={true}
          label="Full name"
          name="fullName"
          type="text"
          placeholder="Enter your full name"
          onChange={(
            e:
              | React.ChangeEvent<HTMLInputElement>
              | React.ChangeEvent<HTMLSelectElement>
          ) => setFullName(e.target.value)}
        />
        <BookInput
          required={false}
          label="Avatar URL"
          name="avatarUrl"
          type="text"
          placeholder="Enter your avatar URL"
          onChange={(
            e:
              | React.ChangeEvent<HTMLInputElement>
              | React.ChangeEvent<HTMLSelectElement>
          ) => setAvatarUrl(e.target.value)}
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
        <BookInput
          required
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Enter your confirm password"
          seePasswordOption
          onChange={(
            e:
              | React.ChangeEvent<HTMLInputElement>
              | React.ChangeEvent<HTMLSelectElement>
          ) => handleCheckConfirmPassword(e.target.value)}
        />
        <PasswordStrengthBar password={password} />
        <BookButton
          disabled={
            !isGoodRegisterPassword ||
            !isGoodRegisterConfirmPassword ||
            !isGoodRegisterEmail
          }
          className="w-full"
          onClick={() => {
            alert('Register successfully!');
            router.replace('/login');
          }}
        >
          Register
        </BookButton>
        <p className="text-center">
          {'Already have account?'}{' '}
          <Link
            className="capitalize text-[#d2455b] hover:text-[#FF5571] duration-300"
            href="/login"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
