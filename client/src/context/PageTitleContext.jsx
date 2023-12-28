import { createContext, useState } from "react";

export const PageTitleContext = createContext();

export const PageTitleProvider = ({ children }) => {
    const [pageTitle, setPageTitle] = useState("");

    const updatePageTitle = (title, tabTitle) => {
        document.title = `${tabTitle || title}`;
        setPageTitle(title);
    };

    return (
        <PageTitleContext.Provider value={{ pageTitle, updatePageTitle }}>
            {children}
        </PageTitleContext.Provider>
    );
};
