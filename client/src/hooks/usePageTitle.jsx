import { PageTitleContext } from "context/PageTitleContext";
import { useContext } from "react";

const usePageTitle = () => {
    const context = useContext(PageTitleContext);
    if (!context) {
        throw new Error(
            "usePageTitle must be used within an PageTitleProvider"
        );
    }
    return context;
};

export default usePageTitle;
