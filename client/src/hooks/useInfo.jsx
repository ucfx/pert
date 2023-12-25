import { InfoContext } from "context/InfoContext";
import { useContext } from "react";

const useInfo = () => {
    const context = useContext(InfoContext);
    if (!context) {
        throw new Error("useInfo must be used within an InfoProvider");
    }
    return context;
};

export default useInfo;
