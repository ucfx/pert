import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
export const InfoContext = createContext();

export const InfoProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchData = async () => {
            try {
                const { data } = await axios.get("/api/users/user-info", {
                    signal: abortController.signal,
                });
                setData(data.user);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();

        return () => {
            console.log("aborting");
            abortController.abort();
        };
    }, []);

    return (
        <InfoContext.Provider value={{ data, loading }}>
            {children}
        </InfoContext.Provider>
    );
};
