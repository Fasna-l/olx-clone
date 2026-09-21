//{Children}  means other componenets.
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../Firebase/Firebase";


const AuthContext = createContext(null);

export const UserAuth = () => useContext(AuthContext);


export const AuthProvider = ({children} ) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    },[]);

    return(
        //oro component leekkum easy aayitt user details kittan aanu Authprovider use cheythath.
        <AuthContext.Provider  value={{user}}>
            {children}
        </AuthContext.Provider>
    )
 }