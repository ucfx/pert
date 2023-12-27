import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchData = async () => {
            try {
                const {
                    data: { projects },
                } = await axios.get("/api/projects", {
                    signal: abortController.signal,
                });
                console.log("projects context", projects);
                setData(projects);
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

    const updateData = (newData) => {
        setData(newData);
    };

    return (
        <ProjectContext.Provider value={{ data, loading, updateData }}>
            {children}
        </ProjectContext.Provider>
    );
};
