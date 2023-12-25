import { lazy } from "react";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
const HeaderDashboard = lazy(() => import("components/HeaderDashboard"));
const UserProfile = () => {
    return (
        <Box>
            <HeaderDashboard />

            <Box p="4" h={"calc(100vh - 64px)"} position={"relative"}>
                <Outlet />
            </Box>
        </Box>
    );
};
export default UserProfile;
