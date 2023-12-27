import { ProjectDetailsContext } from "context/ProjectDetailsContext";
import { useContext } from "react";

const useProjectDetails = () => {
    const context = useContext(ProjectDetailsContext);
    if (!context) {
        throw new Error(
            "ProjectDetailsContext must be used within an ProjectDetailsProvider"
        );
    }
    return context;
};

export default useProjectDetails;
