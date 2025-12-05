import { createContext, useEffect, useState } from "react";
import profile from "../assets/profile.png"

const AppContext = createContext();
export const AppContextProvider = ({ children }) => {

    // // //our dummy value( to be remove) 
    // const defaultUser = {
    //     id : 1,
    //     name : 'mickey mouse',
    //     email : 'micky@notavailable.com',
    //     profileImageUrl : profile,
    //     password : 'forgot',
    //     createdAt : new Date(),
    // }

    const [user, setUser] = useState(null);  //to be changed to null when interating apis

    // Load user if already logged in (page refresh case)
    useEffect(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("userEmail");
        const userId = localStorage.getItem("userId");

        if (token && email && userId) {
            setUser({ token, email, userId });
        }
    }, []);

    const logoutUser = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        // localStorage.clear();
        console.log('localstorage data cleared');
        setUser(null);
    };

    const contextValue = {
        // Define your context values and functions here
        user,
        setUser,
        logoutUser
    };

    useEffect(() => {
        console.log("Updated user value:", user);
    }, [user]);
    
    return (

    <AppContext.Provider value={contextValue}>
        {children}
    </AppContext.Provider>
    );
};

export default AppContext;