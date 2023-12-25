import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import usePageTitle from "hooks/usePageTitle";
import { useEffect } from "react";
const Settings = () => {
    const { updatePageTitle } = usePageTitle();
    useEffect(() => {
        updatePageTitle("Settings");
    }, [updatePageTitle]);

    return (
        <Box>
            <>Settings</>
            <Outlet />
        </Box>
    );
};

export default Settings;
