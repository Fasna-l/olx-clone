import { Carousel, Modal, ModalBody } from 'flowbite-react'
import React, { useState } from 'react'
import mobile from '../../assets/mobile.svg'
import guitar from '../../assets/guita.png'
import love from '../../assets/love.png'
import avatar from '../../assets/avatar.png'
import close from '../../assets/close.svg'
import google from '../../assets/google.png'
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword,  updateProfile } from 'firebase/auth'
import { auth, provider } from '../Firebase/Firebase'

const Login = ({toggleModal,status}) => {
  
  const [emailLogin, setEmailLogin] = useState(false);
  const [signUp, setSignUp] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClick= async()=>{
    try {
        const result = await signInWithPopup(auth,provider);
        toggleModal();
        console.log("User",result.user);

    } catch (error) {
        console.log(error);
    }
  }

  const handleEmailLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      console.log("User", result.user);

      toggleModal();

      setEmail('');
      setPassword('');
      setEmailLogin(false);

    } catch (error) {
      console.log(error);
      alert("Invalid email or password");
    }
  };
  
  const handleSignUp = async () => {
    if (!name || !email || !password) {
      alert("Please enter name, email and password");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(result.user, {
        displayName: name
      });

      console.log("New user", result.user);

      alert("Account created successfully");

      setName('');
      setEmail('');
      setPassword('');
      setEmailLogin(false);
      setSignUp(false);
      toggleModal();

    } catch (error) {
      console.log(error);

      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered");
      } else if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email");
      } else {
        alert("Failed to create account");
      }
    }
  };

  return (
    <div>
       {/* if status true then modal visible else not */}
      <Modal theme={{
        "content": {
          "base": "relative w-full p-4 md:h-auto",
          "inner": "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700"
      },
      }} onClick={toggleModal} show={status} className="bg-black rounded-none"  position={'center'} size="md" popup={true}> 

      <div onClick={(event)=>event.stopPropagation()} className="p-6 pl-2 pr-2 bg-white">
        {/* when close button clicks then modal close aavanam */}
        <img onClick={toggleModal} src={close} alt="" className="w-6 absolute z-10 top-4 right-4 cursor-pointer"/>
        <Carousel slide={false} theme={{
          "indicators": {
              "active": {
                  "off": "bg-gray-300",
                  "on": "bg-teal-300"
              },
              "base": "h-2 w-2 rounded-full",
              "wrapper": "absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-3"
            },
            "scrollContainer": {
                "base": "flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth",
                "snap": "snap-x"
            }, "control": {
                "base": "inline-flex items-center justify-center bg-transparent",
                "icon": "w-8 text-black dark:text-black"
            },
        }} onClick={(event)=>{event.stopPropagation()}} className="w-full h-56 pb-5 rounded-none" >
          
          <div className="flex flex-col items-center justify-center">
              <img className="w-24 pb-5" src={guitar} alt="Car Image 1" />
              <p style={{ color: '#002f34' }} className=" w-60 sm:w-72 text-center pb-5 font-semibold">Help us become one of the safest place to buy and sell.</p>
          </div>
          
          <div className="flex flex-col items-center justify-center">
              <img className="w-24 pb-5" src={love} alt="Car Image 2" />
              <p style={{ color: '#002f34' }} className=" w-60 sm:w-72 text-center pb-5 font-semibold">Close deals from the comfort of your home.</p>
          </div>
          
          <div className="flex flex-col items-center justify-center">
              <img className="w-24 pb-5" src={avatar} alt="Car Image 3" />
              <p style={{ color: '#002f34' }} className=" w-60 sm:w-72 text-center pb-5 font-semibold">Keep all your favorites in one place.</p>
          </div>

        </Carousel>
      </div>

      <ModalBody className="bg-white h-96 p-0 rounded-none" onClick={(event)=>{event.stopPropagation()}}>
        <div className="p-6 pt-0">

          <div className="flex items-center justify-start rounded-md border-2 border-solid border-black p-5 pl-4 relative h-8 mb-4">
            <img className="w-6 mr-2" src={mobile} alt="" />
            <p className="text-sm font-bold">Continue with phone</p>
          </div>

          <div className="flex items-center justify-center rounded-md border-2 border-solid border-gray-300 p-5 relative h-8 cursor-pointer active:bg-teal-100" onClick={handleClick}>
            <img className="w-7 absolute left-2" src={google} alt="" />
            <p className="text-sm text-gray-500">Continue with google</p>
          </div>

          {!emailLogin ? (
            <div className="pt-5 flex flex-col items-center justify-center">
              <p className="font-semibold text-sm">OR</p>

              <p
                onClick={() => setEmailLogin(true)}
                className="font-bold text-sm pt-3 underline underline-offset-4 cursor-pointer"
              >
                Login with email
              </p>
            </div>
            ) : !signUp ? (
            // Login form
            <div className="pt-5">

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border-2 border-gray-300 rounded-md p-3 mb-3 focus:outline-none focus:border-teal-500"
              />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border-2 border-gray-300 rounded-md p-3 mb-3 focus:outline-none focus:border-teal-500"
              />

              <button
                onClick={handleEmailLogin}
                className="w-full bg-teal-600 text-white font-bold rounded-md p-3"
              >
                Login
              </button>

              <p className="text-center text-sm mt-3">
                Don't have an account?{' '}
                <span
                  onClick={() => setSignUp(true)}
                  className="font-bold underline cursor-pointer"
                >
                  Sign Up
                </span>
              </p>

              <p
                onClick={() => setEmailLogin(false)}
                className="text-center text-sm font-semibold underline mt-3 cursor-pointer"
              >
                Back
              </p>

            </div>
          ) : (
            // Sign Up form
            <div className="pt-5">

              <h2 className="text-center font-bold text-lg mb-4">
                Create an account
              </h2>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full border-2 border-gray-300 rounded-md p-3 mb-3 focus:outline-none focus:border-teal-500"
              />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border-2 border-gray-300 rounded-md p-3 mb-3 focus:outline-none focus:border-teal-500"
              />

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border-2 border-gray-300 rounded-md p-3 mb-3 focus:outline-none focus:border-teal-500"
              />

              <button
                onClick={handleSignUp}
                className="w-full bg-teal-600 text-white font-bold rounded-md p-3"
              >
                Create Account
              </button>

              <p
                onClick={() => setSignUp(false)}
                className="text-center text-sm font-semibold underline mt-3 cursor-pointer"
              >
                Back to Login
              </p>

            </div>
          )}

          {/* <div className="pt-5 flex flex-col items-center justify-center">
            <p className="font-semibold text-sm">OR</p>
            <p
              onClick={() => setEmailLogin(true)}
              className="font-bold text-sm pt-3 underline underline-offset-4 cursor-pointer"
            >
              Login with email
            </p>
          </div> */}

          <div  className="pt-10 sm:pt-20 flex flex-col items-center justify-center">
            <p className="text-xs">All your personal details are safe with us.</p>
            <p className="text-xs pt-5 text-center">If you continue, you are accepting <span className="text-blue-600">OLX Terms and Conditions and Privacy Policy</span></p>
          </div>
        </div>
      </ModalBody>
      </Modal>
    </div>
  )
}

export default Login
