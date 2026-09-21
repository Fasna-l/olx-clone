import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore,collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDS9wCFpni9oRnwdGr_ZFwhdGovuEZAHQs",
  authDomain: "olx-clone-ca993.firebaseapp.com",
  projectId: "olx-clone-ca993",
  storageBucket: "olx-clone-ca993.firebasestorage.app",
  messagingSenderId: "797242061165",
  appId: "1:797242061165:web:8bb5548c2e1b5b01b56a64"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage();
const fireStore = getFirestore();


const fetchFromFirestore = async ()=>{
    try {
        const productsCollection = collection(fireStore, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) 
        console.log("Fetched products from Firestore:", productList);
        return productList;
    } catch (error) {
        console.error("Error fetching products from Firestore:", error)
        return []
    }
}

export {
    auth,
    provider,
    storage,
    fireStore,
    fetchFromFirestore
}