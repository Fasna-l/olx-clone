// here we give details of each items

import React from 'react'
import { Link } from 'react-router-dom'
import { Wishlist } from '../Context/Wishlist'


const Card = ({ items }) => {

  const {
    wishlist,
    toggleWishlist
  } = Wishlist()


  return (

    <div className='p-10 px-5 sm:px-15 md:px-30 lg:px-40 min-h-screen'>

      <h1
        style={{ color: '#002f34' }}
        className="text-2xl"
      >
        Fresh recommendations
      </h1>


      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-5'>

        {items.map((item) => {

          const isWishlisted = wishlist.some(
            wishlistItem =>
              String(wishlistItem.id) === String(item.id)
          )


          return (

            <Link
              to={'/details'}
              state={{ item }}
              key={item.id}
              style={{
                borderWidth: '1px',
                borderColor: 'lightgrey'
              }}
            >

              <div
                style={{
                  borderWidth: '1px',
                  borderColor: 'lightgray'
                }}
                className='relative w-full h-72 rounded-md border-solid bg-gray-50 overflow-hidden cursor-pointer'
              >


                {/* Display Images */}

                <div className='w-full flex justify-center p-2 overflow-hidden'>

                  <img
                    className='h-36 object-contain'
                    src={
                      item.imageUrl ||
                      'https://via.placeholder.com/150'
                    }
                    alt={item.title}
                  />

                </div>


                {/* Display details */}

                <div className='details p-1 pl-4 pr-4'>

                  <h1
                    style={{ color: '#002f34' }}
                    className="font-bold text-xl"
                  >
                    ₹ {item.price}
                  </h1>


                  <p className="text-sm pt-2">
                    {item.category}
                  </p>


                  <p className="pt-2">
                    {item.title}
                  </p>


                  {/* Favorite Icon */}

                  <div
                    onClick={(event) => {

                      event.preventDefault()
                      event.stopPropagation()

                      toggleWishlist(item)

                    }}
                    className='absolute flex justify-center items-center p-2 bg-white rounded-full top-3 right-3 cursor-pointer'
                  >

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                      fill={
                        isWishlisted
                          ? "red"
                          : "none"
                      }
                      stroke={
                        isWishlisted
                          ? "red"
                          : "#002f34"
                      }
                      strokeWidth="2"
                    >

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
                      />

                    </svg>

                  </div>

                </div>

              </div>

            </Link>

          )

        })}

      </div>

    </div>

  )

}


export default Card