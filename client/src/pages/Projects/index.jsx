import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import usePageTitle from "hooks/usePageTitle";
import { useEffect } from "react";
const Projects = () => {
    const { updatePageTitle } = usePageTitle();
    useEffect(() => {
        updatePageTitle("Projects");
    }, [updatePageTitle]);

    return (
        <Box>
            <>Projets</>
            <Outlet />
        </Box>
    );
};

export default Projects;
