import axios from "axios";
import { createContext, useEffect, useReducer } from "react";

export const AuthContext = createContext();

export const AuthReducer = (user, action) => {
    switch (action.type) {
        case "LOGIN":
            return action.payload;

        case "LOGOUT":
            return null;

        default:
            return user;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, dispatch] = useReducer(
        AuthReducer,
        JSON.parse(localStorage.getItem("user")) || null
    );

    console.log("user: ", user);
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    useEffect(() => {
        console.log("authing");
        axios
            .get("/api/auth")
            .then((res) => {
                dispatch({ type: "LOGIN", payload: res.data });
            })
            .catch((err) => {
                dispatch({ type: "LOGOUT" });
                console.log(err);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ user, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
