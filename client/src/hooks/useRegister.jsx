import { useState } from "react";
import axios from "axios";

const useRegister = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const register = async (data) => {
        setError(null);
        setIsLoading(true);

        // try {
        //     const res = await axios.post("/api/users/register", data);
        //     console.log(res.data);
        //     showSuccessAlert();
        // } catch (err) {
        //     setError(err.response.data.errors);
        // } finally {
        //     setIsLoading(false);
        // }
        return new Promise((resolve, reject) => {
            axios
                .post("/api/users/register", data)
                .then((res) => {
                    console.log(res.data);
                    resolve();
                })
                .catch((err) => {
                    console.log(err);
                    setError(err.response.data.errors);
                    reject();
                })
                .finally(() => {
                    setIsLoading(false);
                });
        });
    };

    return { error, isLoading, register };
    //     return { error, register };
};
export default useRegister;
