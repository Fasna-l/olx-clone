import React, { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Login from '../Modal/Login'
import Sell from '../Modal/Sell'
import Card from '../Card/Card'
import { ItemsContext } from '../Context/Item'

const Home = () => {

  const [openModal, setModal] = useState(false)
  const [openModalSell, setModalSell] = useState(false)

  // Search text
  const [searchTerm, setSearchTerm] = useState('')


  const toggleModal = () => {
    setModal(!openModal)
  }


  const toggleModalSell = () => {
    setModalSell(!openModalSell)
  }


  // Get products from Items Context
  const itemsCtx = ItemsContext()


  // Filter products based on search
  const filteredItems = itemsCtx.items.filter((item) => {

    const search = searchTerm.toLowerCase().trim()

    if (!search) {
      return true
    }

    const title = item.title?.toLowerCase() || ''
    const category = item.category?.toLowerCase() || ''

    return (
      title.includes(search) ||
      category.includes(search)
    )
  })


  return (
    <div>

      <Navbar
        toggleModal={toggleModal}
        toggleModalSell={toggleModalSell}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />


      <Login
        toggleModal={toggleModal}
        status={openModal}
      />


      <Sell
        setItems={itemsCtx.setItems}
        toggleModalSell={toggleModalSell}
        status={openModalSell}
      />


      {itemsCtx.loading ? (

        <div className="flex justify-center items-center min-h-[400px]">

          <p
            className="text-lg"
            style={{ color: '#002f34' }}
          >
            Loading products...
          </p>

        </div>

      ) : filteredItems.length === 0 ? (

        <div className="flex flex-col justify-center items-center min-h-[400px]">

          <p
            className="text-xl font-semibold"
            style={{ color: '#002f34' }}
          >
            No products found
          </p>

          <p className="text-gray-500 mt-2">
            Try searching for another product.
          </p>

        </div>

      ) : (

        <Card
          items={filteredItems}
        />

      )}

    </div>
  )
}

export default Home