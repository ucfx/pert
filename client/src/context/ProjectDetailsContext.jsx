import React, { createContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
export const ProjectDetailsContext = createContext();

export const ProjectDetailsProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { projectId } = useParams();
    useEffect(() => {
        const abortController = new AbortController();

        const fetchData = async () => {
            try {
                const {
                    data: { project },
                } = await axios.get(`/api/projects/${projectId}`, {
                    signal: abortController.signal,
                });
                setData(project);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            console.log("aborting");
            abortController.abort();
        };
    }, []);

    const updateData = async (newData) => {
        setData(newData);
    };

    return (
        <ProjectDetailsContext.Provider value={{ data, loading, updateData }}>
            {children}
        </ProjectDetailsContext.Provider>
    );
};
