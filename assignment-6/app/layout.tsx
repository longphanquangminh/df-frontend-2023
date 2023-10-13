import { Suspense } from 'react';
import { AppContextProvider } from './context/AppContext';
import './global.css';
import Loading from './components/Loading';
import BookHeader from './components/BookHeader';
import AxiosSetup from './components/AxiosSetup';
import PrivateRoute from './components/PrivateRoute';

export const metadata = {
  title: 'Welcome to assignment-6',
  description: 'Generated by create-nx-workspace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppContextProvider>
          <Suspense fallback={<Loading />}>
            <Loading />
            <AxiosSetup />
            <PrivateRoute>
              <div className="flex flex-col min-h-screen bg-[#f7f8fa]">
                <div>
                  <BookHeader />
                </div>
                {children}
              </div>
            </PrivateRoute>
          </Suspense>
        </AppContextProvider>
      </body>
    </html>
  );
}
