import { createContext, useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, fireStore } from "../Firebase/Firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc
} from "firebase/firestore";
import { toast } from "react-toastify";


const WishlistContext = createContext(null);


export const Wishlist = () => useContext(WishlistContext);


export const WishlistProvider = ({ children }) => {

  const [user] = useAuthState(auth);

  const [wishlist, setWishlist] = useState([]);


  // Fetch wishlist when user logs in

  useEffect(() => {

    const fetchWishlist = async () => {

      if (!user) {
        setWishlist([]);
        return;
      }

      try {

        const wishlistRef = collection(
          fireStore,
          "users",
          user.uid,
          "wishlist"
        );

        const wishlistSnapshot = await getDocs(wishlistRef);

        const wishlistItems = wishlistSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setWishlist(wishlistItems);

      } catch (error) {

        console.log(
          "Error fetching wishlist:",
          error
        );

      }

    };

    fetchWishlist();

  }, [user]);


  // Add or remove wishlist item

  const toggleWishlist = async (item) => {

    if (!user) {

      toast.info(
        "Please login to add items to wishlist"
      );

      return;

    }


    const isWishlisted = wishlist.some(
      wishlistItem =>
        String(wishlistItem.id) === String(item.id)
    );


    const wishlistItemRef = doc(
      fireStore,
      "users",
      user.uid,
      "wishlist",
      item.id
    );


    if (isWishlisted) {

      // Update UI immediately

      setWishlist(prev =>
        prev.filter(
          wishlistItem =>
            String(wishlistItem.id) !== String(item.id)
        )
      );

      toast.info("Removed from wishlist");


      try {

        await deleteDoc(wishlistItemRef);

      } catch (error) {

        console.log(
          "Error removing wishlist item:",
          error
        );

        // Restore item if Firebase fails

        setWishlist(prev => [
          ...prev,
          {
            id: item.id,
            ...item
          }
        ]);

        toast.error(
          "Failed to remove from wishlist"
        );

      }

    } else {

      const wishlistItem = {
        id: item.id,
        productId: item.id,
        title: item.title,
        price: item.price,
        category: item.category,
        imageUrl: item.imageUrl
      };


      // Update UI immediately

      setWishlist(prev => [
        ...prev,
        wishlistItem
      ]);

      toast.success("Added to wishlist");


      try {

        await setDoc(
          wishlistItemRef,
          {
            productId: item.id,
            title: item.title,
            price: item.price,
            category: item.category,
            imageUrl: item.imageUrl
          }
        );

      } catch (error) {

        console.log(
          "Error adding wishlist item:",
          error
        );

        // Remove item if Firebase fails

        setWishlist(prev =>
          prev.filter(
            wishlistItem =>
              String(wishlistItem.id) !== String(item.id)
          )
        );

        toast.error(
          "Failed to add to wishlist"
        );

      }

    }

  };


  return (

    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist
      }}
    >

      {children}

    </WishlistContext.Provider>

  );

};