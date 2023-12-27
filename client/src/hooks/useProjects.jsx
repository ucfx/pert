import { ProjectContext } from "context/ProjectContext";
import { useContext } from "react";

const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProject must be used within an ProjectProvider");
    }
    return context;
};

export default useProject;
