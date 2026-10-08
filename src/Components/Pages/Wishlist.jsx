// Wishlist page

import React from 'react'
import { Link } from 'react-router-dom'
import { Wishlist as useWishlist } from '../Context/Wishlist'


const Wishlist = () => {

  const {
    wishlist,
    toggleWishlist
  } = useWishlist()


  return (

    <div className='p-10 px-5 sm:px-15 md:px-30 lg:px-40 min-h-screen'>

      <h1
        style={{ color: '#002f34' }}
        className='text-2xl font-bold mb-5'
      >
        My Wishlist
      </h1>


      {wishlist.length === 0 ? (

        <div className='flex justify-center items-center min-h-[300px]'>

          <p className='text-lg'>
            Your wishlist is empty.
          </p>

        </div>

      ) : (

        <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>

          {wishlist.map((item) => (

            <div
              key={item.id}
              className='relative w-full h-72 rounded-md border border-gray-300 bg-gray-50 overflow-hidden'
            >

              <Link
                to='/details'
                state={{
                  item: {
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    category: item.category,
                    imageUrl: item.imageUrl
                  }
                }}
              >

                {/* Display Image */}

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


                {/* Display Details */}

                <div className='p-4'>

                  <h1
                    style={{ color: '#002f34' }}
                    className='font-bold text-xl'
                  >
                    ₹ {item.price}
                  </h1>


                  <p className='text-sm pt-2'>
                    {item.category}
                  </p>


                  <p className='pt-2'>
                    {item.title}
                  </p>

                </div>

              </Link>


              {/* Remove from Wishlist */}

              <button
                onClick={() =>
                  toggleWishlist(item)
                }
                className='absolute top-3 right-3 bg-white rounded-full px-3 py-2 cursor-pointer'
              >

                ❤️

              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  )

}


export default Wishlist