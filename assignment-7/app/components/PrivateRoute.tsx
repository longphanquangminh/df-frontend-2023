'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { userLocalStorage } from '../api/user/localService';

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const alreadyLogin = Boolean(userLocalStorage.get()?.accessToken);
    if (!alreadyLogin && pathname !== '/login') {
      router.replace('/login');
    } else if (alreadyLogin && pathname === '/login') {
      router.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return children;
}
