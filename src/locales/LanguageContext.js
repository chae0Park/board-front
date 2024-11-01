import React, { createContext, useContext } from "react";
import i18n from "./i18n";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return(
        <LanguageContext.Provider value={{changeLanguage}}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    return useContext(LanguageContext);
};