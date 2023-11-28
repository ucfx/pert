import axios from "axios";
import { createContext, useEffect, useReducer } from "react";

export const AuthContext = createContext();

export const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                user: action.payload,
            };
        case "LOGOUT":
            return {
                ...state,
                user: null,
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, {
        user: localStorage.getItem("user"),
    });

    console.log("state: ", state);
    useEffect(() => {
        if (state.user)
            localStorage.setItem("user", JSON.stringify(state.user));
        else {
            localStorage.removeItem("user");
        }
    }, [state.user]);

    useEffect(() => {
        axios
            .get("/api/auth")
            .then((res) => {
                if (res.data.user) {
                    dispatch({
                        type: "LOGIN",
                        payload: res.data.user,
                    });
                } else {
                    dispatch({
                        type: "LOGOUT",
                    });
                }
            })
            .catch((err) => {
                axios.post("/api/users/logout").then((res) => {
                    dispatch({
                        type: "LOGOUT",
                    });
                });
            });
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
