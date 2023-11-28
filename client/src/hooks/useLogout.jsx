import { useState } from "react";
import { useAuth } from "./index";
import axios from "axios";

const useLogout = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuth();
    const logout = () => {
        setError(null);
        setIsLoading(true);
        axios
            .post("/api/users/logout")
            .then((res) => {
                console.log(res.data);
                dispatch({
                    type: "LOGOUT",
                });
            })
            .catch((err) => {
                console.log(err);
                setError(err.response.data.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return { error, isLoading, logout };
};
export default useLogout;
