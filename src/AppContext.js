import React, { useState, createContext } from 'react';

export const AppContext = createContext(); 

export const AppProvider = props => {
    const [darkMode, setDarkMode] = useState(false);

    return(
        <AppContext.Provider>
            {props.children}
        </AppContext.Provider>
    );
}
