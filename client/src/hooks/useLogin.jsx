import { useState } from "react";
import useAuth from "hooks/useAuth";
import axios from "axios";

const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuth();
    const login = (data) => {
        setError(null);
        setIsLoading(true);
        axios
            .post("/api/users/login", data)
            .then((res) => {
                console.log(res.data);
                dispatch({
                    type: "LOGIN",
                    payload: res.data.user,
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

    return { error, isLoading, login };
};
export default useLogin;
