import React,{useEffect,useState} from 'react'
import Navbar from '../Navbar/Navbar'
import Login from '../Modal/Login';
import Sell from '../Modal/Sell';
import Card from '../Card/Card';
import { ItemsContext } from '../Context/Item';
import { fetchFromFirestore } from '../Firebase/Firebase'

const Home = () => {
  const [openModal ,setModal] = useState(false);
  const [openModalSell,setModalSell] = useState(false);

  const toggleModal = () =>{setModal(!openModal)}
  const toggleModalSell = ()=>{setModalSell(!openModalSell)}
  
  // oro item firestore il ninnum edukkanam
  const itemsCtx =ItemsContext();//refers to the context value;
  
  useEffect(()=>{

    const getItems = async ()=>{
      const datas = await fetchFromFirestore();
      itemsCtx ?.setItems(datas); //(it is the setItems function provided by the context) => Fetch and set items in context
                        // datas means it is the fetched data from the fireStore.
    }
    
    
    getItems();
    
  },[])

  useEffect(()=>{
    console.log('Updated Items:' ,itemsCtx.items);

  },[itemsCtx.items])
  
  return (
    <div>
      <Navbar toggleModal={toggleModal} toggleModalSell={toggleModalSell} />
      <Login toggleModal={toggleModal} status = {openModal} />
      <Sell setItems={(itemsCtx).setItems} toggleModalSell={toggleModalSell} status = {openModalSell} />
      <Card items={(itemsCtx).items  || []} />
                                      {/* if items is not there then an empty array. */}
    </div>
  )
}

export default Home
