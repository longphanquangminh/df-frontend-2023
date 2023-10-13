'use client';

import PasswordStrengthBar from 'react-password-strength-bar-with-style-item';
import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { loadingTimeout } from '../constants/variables';
import { emailRegex } from '../regex/emailRegex';
import convertAccentedVietnamese from '../utils/convertAccentedVietnamese';
import { https } from '../api/user/config';
import BookInput from '../components/BookInput';
import BookButton from '../components/BookButton';
import { passwordRegex } from '../regex/passwordRegex';

export default function LoginPage() {
  const [isGoodLoginEmail, setIsGoodLoginEmail] = useState(false);
  const [isGoodLoginPassword, setIsGoodLoginPassword] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const { editLoadingFalse, setUserLogin } = useAppContext();
  useEffect(() => {
    setTimeout(() => {
      editLoadingFalse();
    }, loadingTimeout);
  }, []);
  const handleCheckEmail = (value: string) => {
    setUserEmail(value);
    if (emailRegex.test(value)) {
      setIsGoodLoginEmail(true);
    } else {
      setIsGoodLoginEmail(false);
    }
  };
  const handleCheckPassword = (value: string) => {
    setPassword(value);
    if (passwordRegex.test(convertAccentedVietnamese(value))) {
      setIsGoodLoginPassword(true);
    } else {
      setIsGoodLoginPassword(false);
    }
  };
  const handleSubmit = () => {
    https
      .post(`/auth/login`, {
        email: userEmail,
        password: password,
      })
      .then((res) => {
        setUserLogin(res.data.data);
        window.location.href = '/';
      })
      .catch((err) => {
        console.error(err);
        alert('Your login info is not correct! Please check sir');
      });
  };
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
        <PasswordStrengthBar password={password} />
        <BookButton
          disabled={!isGoodLoginPassword || !isGoodLoginEmail}
          className="w-full"
          onClick={handleSubmit}
        >
          Login
        </BookButton>
      </div>
    </div>
  );
}
