import { createContext, useState } from "react";
import profile from "../assets/profile.png"

const AppContext = createContext();
export const AppContextProvider = ({ children }) => {
    
    //our dummy value( to be remove) 
    const defaultUser = {
        id : 1,
        name : 'micky mouse',
        email : 'micky@notavailable.com',
        profileImageUrl : profile,
        password : 'forgot',
        createdAt : new Date(),
    }

    const [user , setUser] = useState(defaultUser);  //to be changed to null when interating apis


    const contextValue = {
        // Define your context values and functions here
        user,
        setUser
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;