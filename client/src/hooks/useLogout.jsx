import { useState } from "react";
import useAuth from "hooks/useAuth";
import axios from "axios";

const useLogout = () => {
    const { dispatch } = useAuth();
    const logout = () => {
        return new Promise((resolve, reject) => {
            axios
                .post("/api/users/logout")
                .then((res) => {
                    dispatch({
                        type: "LOGOUT",
                    });
                    resolve();
                })
                .catch((err) => {
                    console.log(err);
                    reject();
                });
        });
    };

    return { logout };
};
export default useLogout;
