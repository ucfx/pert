import { useState } from "react";
import axios from "axios";

const useRegister = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const register = (data) => {
        setError(null);
        setIsLoading(true);
        axios
            .post("/api/users/register", data)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
                setError(err.response.data);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return { error, isLoading, register };
};
export default useRegister;
