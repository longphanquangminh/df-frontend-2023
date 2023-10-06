import { ClipLoader } from 'react-spinners'
import { useAppContext } from '../context/AppContext'

export default function Loading() {
  const loadingColor = '#FF5571'
  const { loading } = useAppContext()
  if (loading)
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-white z-50 flex justify-center items-center">
        <ClipLoader
          color={loadingColor}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    )
}
