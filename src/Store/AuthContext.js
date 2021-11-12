import React, { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router";
const AuthContext = React.createContext({
    user: {},
    message: '',
    createName:(name)=>{},
    userName:'',
    alertMsg:(message)=>{},
    isLoggedIn: false,
    logout:()=>{}
});



export const AuthContextProvider = (props) => {
    const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();
    onAuthStateChanged(auth, (authUser) => {
    if (authUser) {
      setUserIsLoggedIn(true);
        setUser(authUser);
        setUserName(prevName => {
            if (prevName !== null) return prevName;
            else return authUser.displayName;
        });
    // ...
    } else {
    // User is signed out
        
    setUserName(null);
    // ...
    }
    });
    const [message, setMessage] = useState(null);
    const userNameHandler = (name) => {
        setUserName(name);
    };
    const messageHandler = (msg) => {
        setMessage(msg);
    };

    const logoutHandler = () => {
        auth.signOut().then(() => {
            setUser(null);
            setUserIsLoggedIn(false);
            setMessage("Logged Out");
            setUserName(null);
            navigate("/", { replace: "true" });
        });
    };

    
    const contextValue = {
        user: user,
        userName:userName,
        message: message,
        createName: userNameHandler,
        alertMsg:messageHandler,
        isLoggedIn: userIsLoggedIn,
        logout: logoutHandler
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext;