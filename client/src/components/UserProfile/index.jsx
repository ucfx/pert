import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import HeaderDashboard from "components/HeaderDashboard";
import useInfo from "hooks/useInfo";
const UserProfile = () => {
    const { data, loading } = useInfo();
    console.log("data", data);
    return (
        <Box>
            {!loading && <HeaderDashboard user={data} loading={loading} />}

            <Box h={"calc(100vh - 64px)"} position={"relative"}>
                {!loading && <Outlet />}
            </Box>
        </Box>
    );
};
export default UserProfile;
