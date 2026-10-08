import React, { lazy, Suspense, useEffect, useRef } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { UserAuth } from './Components/Context/Auth'

const Home = lazy(() => import('./Components/Pages/Home'))
const Details = lazy(() => import('./Components/Details/Details'))
const Wishlist = lazy(() => import('./Components/Pages/Wishlist'))

// Protected Route
const ProtectedRoute = ({ children }) => {

  const { user } = UserAuth()
  const toastShown = useRef(false)

  useEffect(() => {
    if (!user && !toastShown.current) {
      toast.info("Please login to continue")
      toastShown.current = true
    }
  }, [user])

  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}

const App = () => {
  return (
    <>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <p
              className="text-lg"
              style={{ color: '#002f34' }}
            >
              Loading page...
            </p>
          </div>
        }
      >
        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/details"
            element={<Details />}
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  )
}

export default App