import { lazy } from "react";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
const HeaderDashboard = lazy(() => import("components/HeaderDashboard"));
import useInfo from "../../hooks/useInfo";
const UserProfile = () => {
    const { data, loading } = useInfo();
    console.log("data", data);
    return (
        <Box>
            <HeaderDashboard user={data} loading={loading} />

            <Box p="4" h={"calc(100vh - 64px)"} position={"relative"}>
                {data && <Outlet context={{ data, loading }} />}
            </Box>
        </Box>
    );
};
export default UserProfile;
