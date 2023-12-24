import { useState } from "react";
import axios from "axios";

const useSearch = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dataSearch, setDataSearch] = useState(null);
    const search = (username) => {
        setError(null);
        setIsLoading(true);

        if (!username || username.length < 4) {
            setDataSearch(null);
            return;
        }
        axios
            .post("/api/users/search", { username })
            .then((res) => {
                setDataSearch(res.data);
            })
            .catch((err) => {
                console.log(err);
                setError(err.response.data.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return { error, isLoading, search, dataSearch };
};

export default useSearch;
