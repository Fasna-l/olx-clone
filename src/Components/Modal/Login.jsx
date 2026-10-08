import { Carousel, Modal, ModalBody } from 'flowbite-react'
import React, { useState } from 'react'

import mobile from '../../assets/mobile.svg'
import guitar from '../../assets/guita.png'
import love from '../../assets/love.png'
import avatar from '../../assets/avatar.png'
import close from '../../assets/close.svg'
import google from '../../assets/google.png'

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut
} from 'firebase/auth'

import { auth, provider } from '../Firebase/Firebase'
import { toast } from 'react-toastify'


const Login = ({ toggleModal, status }) => {

  const [emailLogin, setEmailLogin] = useState(false)
  const [signUp, setSignUp] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Login errors
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // Signup errors
  const [nameError, setNameError] = useState('')


  // --------------------------------
  // Google Login
  // --------------------------------

  const handleClick = async () => {

    try {

      const result = await signInWithPopup(
        auth,
        provider
      )

      console.log('User', result.user)

      toggleModal()

    } catch (error) {

      console.log(error)

    }
  }


  // --------------------------------
  // Email Login
  // --------------------------------

  const handleEmailLogin = async () => {

    setEmailError('')
    setPasswordError('')

    let isValid = true


    if (!email.trim()) {

      setEmailError('Please enter your email')
      isValid = false

    }


    if (!password.trim()) {

      setPasswordError('Please enter your password')
      isValid = false

    }


    if (!isValid) {
      return
    }


    try {

      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      console.log('User', result.user)

      // Close login modal
      toggleModal()

      // Clear form
      setEmail('')
      setPassword('')

      setEmailLogin(false)

    } catch (error) {

      console.log(error)

      setPasswordError('Invalid email or password')

    }
  }


  // --------------------------------
  // Signup
  // --------------------------------

  const handleSignUp = async () => {

    setNameError('')
    setEmailError('')
    setPasswordError('')

    let isValid = true


    // Name validation
    if (!name.trim()) {

      setNameError('Please enter your name')
      isValid = false

    }


    // Email validation
    if (!email.trim()) {

      setEmailError('Please enter your email')
      isValid = false

    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

      setEmailError('Please enter a valid email')
      isValid = false

    }


    // Password validation
    if (!password.trim()) {

      setPasswordError('Please enter your password')
      isValid = false

    } else if (password.length < 6) {

      setPasswordError(
        'Password should be at least 6 characters'
      )

      isValid = false
    }


    if (!isValid) {
      return
    }


    try {

      // Create Firebase account
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )


      // Add user's name to Firebase profile
      await updateProfile(result.user, {
        displayName: name
      })


      console.log('New user', result.user)


      // Firebase automatically logs the new user in.
      // We sign them out because we want them
      // to login manually after signup.
      await signOut(auth)


      // Keep email so user doesn't need
      // to type it again.
      setPassword('')
      setName('')

      // Go back to login form
      setSignUp(false)
      setEmailLogin(true)


      // Show success message
      toast.success(
        'Account created. Please login'
      )


    } catch (error) {

      console.log(error)


      if (
        error.code === 'auth/email-already-in-use'
      ) {

        setEmailError(
          'This email is already registered'
        )

      } else if (
        error.code === 'auth/weak-password'
      ) {

        setPasswordError(
          'Password should be at least 6 characters'
        )

      } else if (
        error.code === 'auth/invalid-email'
      ) {

        setEmailError(
          'Please enter a valid email'
        )

      } else {

        setEmailError(
          'Failed to create account'
        )

      }
    }
  }


  return (

    <div>

      {/* Login Modal */}

      <Modal
        theme={{
          content: {
            base: 'relative w-full p-4 md:h-auto',
            inner:
              'relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700'
          }
        }}
        onClick={toggleModal}
        show={status}
        className="bg-black rounded-none"
        position="center"
        size="md"
        popup={true}
      >

        <div
          onClick={(event) =>
            event.stopPropagation()
          }
          className="p-6 pl-2 pr-2 bg-white"
        >

          {/* Close button */}

          <img
            onClick={toggleModal}
            src={close}
            alt=""
            className="w-6 absolute z-10 top-4 right-4 cursor-pointer"
          />


          {/* Carousel */}

          <Carousel
            slide={false}
            theme={{
              indicators: {
                active: {
                  off: 'bg-gray-300',
                  on: 'bg-teal-300'
                },
                base: 'h-2 w-2 rounded-full',
                wrapper:
                  'absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-3'
              },

              scrollContainer: {
                base:
                  'flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth',
                snap: 'snap-x'
              },

              control: {
                base:
                  'inline-flex items-center justify-center bg-transparent',
                icon: 'w-8 text-black dark:text-black'
              }
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="w-full h-56 pb-5 rounded-none"
          >

            {/* Carousel 1 */}

            <div className="flex flex-col items-center justify-center">

              <img
                className="w-24 pb-5"
                src={guitar}
                alt="Car Image 1"
              />

              <p
                style={{ color: '#002f34' }}
                className="w-60 sm:w-72 text-center pb-5 font-semibold"
              >
                Help us become one of the safest place
                to buy and sell.
              </p>

            </div>


            {/* Carousel 2 */}

            <div className="flex flex-col items-center justify-center">

              <img
                className="w-24 pb-5"
                src={love}
                alt="Car Image 2"
              />

              <p
                style={{ color: '#002f34' }}
                className="w-60 sm:w-72 text-center pb-5 font-semibold"
              >
                Close deals from the comfort of your
                home.
              </p>

            </div>


            {/* Carousel 3 */}

            <div className="flex flex-col items-center justify-center">

              <img
                className="w-24 pb-5"
                src={avatar}
                alt="Car Image 3"
              />

              <p
                style={{ color: '#002f34' }}
                className="w-60 sm:w-72 text-center pb-5 font-semibold"
              >
                Keep all your favorites in one place.
              </p>

            </div>

          </Carousel>

        </div>


        {/* Modal Body */}

        <ModalBody
          className="bg-white h-96 p-0 rounded-none"
          onClick={(event) =>
            event.stopPropagation()
          }
        >

          <div className="p-6 pt-0">


            {/* Phone Login */}

            <div className="flex items-center justify-start rounded-md border-2 border-solid border-black p-5 pl-4 relative h-8 mb-4">

              <img
                className="w-6 mr-2"
                src={mobile}
                alt=""
              />

              <p className="text-sm font-bold">
                Continue with phone
              </p>

            </div>


            {/* Google Login */}

            <div
              className="flex items-center justify-center rounded-md border-2 border-solid border-gray-300 p-5 relative h-8 cursor-pointer active:bg-teal-100"
              onClick={handleClick}
            >

              <img
                className="w-7 absolute left-2"
                src={google}
                alt=""
              />

              <p className="text-sm text-gray-500">
                Continue with google
              </p>

            </div>


            {/* Email Login */}

            {!emailLogin ? (

              <div className="pt-5 flex flex-col items-center justify-center">

                <p className="font-semibold text-sm">
                  OR
                </p>

                <p
                  onClick={() =>
                    setEmailLogin(true)
                  }
                  className="font-bold text-sm pt-3 underline underline-offset-4 cursor-pointer"
                >
                  Login with email
                </p>

              </div>

            ) : !signUp ? (

              /* -------------------------
                 LOGIN FORM
              -------------------------- */

              <div className="pt-5">


                {/* Email */}

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => {

                    setEmail(event.target.value)
                    setEmailError('')

                  }}
                  className={`w-full border-2 rounded-md p-3 focus:outline-none ${
                    emailError
                      ? 'border-red-500'
                      : 'border-gray-300 focus:border-teal-500'
                  }`}
                />


                {emailError && (

                  <p className="text-red-500 text-sm mt-1 mb-2">
                    {emailError}
                  </p>

                )}


                {/* Password */}

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {

                    setPassword(event.target.value)
                    setPasswordError('')

                  }}
                  className={`w-full border-2 rounded-md p-3 focus:outline-none ${
                    passwordError
                      ? 'border-red-500'
                      : 'border-gray-300 focus:border-teal-500'
                  }`}
                />


                {passwordError && (

                  <p className="text-red-500 text-sm mt-1 mb-2">
                    {passwordError}
                  </p>

                )}


                {/* Login button */}

                <button
                  onClick={handleEmailLogin}
                  className="w-full bg-teal-600 text-white font-bold rounded-md p-3"
                >
                  Login
                </button>


                {/* Signup link */}

                <p className="text-center text-sm mt-3">

                  Don't have an account?{' '}

                  <span
                    onClick={() =>
                      setSignUp(true)
                    }
                    className="font-bold underline cursor-pointer"
                  >
                    Sign Up
                  </span>

                </p>


                {/* Back */}

                <p
                  onClick={() =>
                    setEmailLogin(false)
                  }
                  className="text-center text-sm font-semibold underline mt-3 cursor-pointer"
                >
                  Back
                </p>

              </div>

            ) : (

              /* -------------------------
                 SIGNUP FORM
              -------------------------- */

              <div className="pt-5">


                <h2 className="text-center font-bold text-lg mb-4">
                  Create an account
                </h2>


                {/* Name */}

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(event) => {

                    setName(event.target.value)
                    setNameError('')

                  }}
                  className={`w-full border-2 rounded-md p-3 mb-1 focus:outline-none ${
                    nameError
                      ? 'border-red-500'
                      : 'border-gray-300 focus:border-teal-500'
                  }`}
                />


                {nameError && (

                  <p className="text-red-500 text-sm mb-2">
                    {nameError}
                  </p>

                )}


                {/* Email */}

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => {

                    setEmail(event.target.value)
                    setEmailError('')

                  }}
                  className={`w-full border-2 rounded-md p-3 mb-1 focus:outline-none ${
                    emailError
                      ? 'border-red-500'
                      : 'border-gray-300 focus:border-teal-500'
                  }`}
                />


                {emailError && (

                  <p className="text-red-500 text-sm mb-2">
                    {emailError}
                  </p>

                )}


                {/* Password */}

                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) => {

                    setPassword(event.target.value)
                    setPasswordError('')

                  }}
                  className={`w-full border-2 rounded-md p-3 mb-1 focus:outline-none ${
                    passwordError
                      ? 'border-red-500'
                      : 'border-gray-300 focus:border-teal-500'
                  }`}
                />


                {passwordError && (

                  <p className="text-red-500 text-sm mb-2">
                    {passwordError}
                  </p>

                )}


                {/* Create Account */}

                <button
                  onClick={handleSignUp}
                  className="w-full bg-teal-600 text-white font-bold rounded-md p-3"
                >
                  Create Account
                </button>


                {/* Back to Login */}

                <p
                  onClick={() => {

                    setSignUp(false)

                    setNameError('')
                    setEmailError('')
                    setPasswordError('')

                  }}
                  className="text-center text-sm font-semibold underline mt-3 cursor-pointer"
                >
                  Back to Login
                </p>

              </div>

            )}


            {/* Footer */}

            <div className="pt-10 sm:pt-20 flex flex-col items-center justify-center">

              <p className="text-xs">
                All your personal details are safe with us.
              </p>

              <p className="text-xs pt-5 text-center">

                If you continue, you are accepting{' '}

                <span className="text-blue-600">
                  OLX Terms and Conditions and Privacy Policy
                </span>

              </p>

            </div>

          </div>

        </ModalBody>

      </Modal>

    </div>
  )
}

export default Login