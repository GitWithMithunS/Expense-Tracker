import { createContext, useState } from "react";

const AppContext = createContext();
export const AppContextProvider = ({ children }) => {

    const [user , setUser] = useState(null);
    
    const contextValue = {
        // Define your context values and functions here
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;