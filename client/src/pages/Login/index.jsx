import "styles/layout/form.css";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Button from "components/Button";
import Loader from "components/Loader";
import { Link } from "react-router-dom";
import useLogin from "hooks/useLogin";

const Login = () => {
    const {
        setError,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { login, isLoading, error } = useLogin();

    const [passwordInputType, setPasswordInputType] = useState("password");

    const onError = (errors) => {
        console.log(errors);
    };

    useEffect(() => {
        if (error) {
            setError("username", {
                type: "manual",
                message: error,
            });
            setError("password", {
                type: "manual",
                message: error,
            });
        }
    }, [error]);

    const [usernameVlaid, setUsernameValid] = useState(false);
    const [passwordVlaid, setPasswordValid] = useState(false);

    return (
        <div className="login">
            {isLoading && <Loader />}
            <div className="container">
                <div className="form-container">
                    <div className="form-content">
                        <h1>Login</h1>
                        <form onSubmit={handleSubmit(login, onError)}>
                            <div
                                className={`input-field ${
                                    usernameVlaid ? "valid" : ""
                                }`}
                            >
                                <input
                                    {...register("username", {
                                        required: {
                                            value: true,
                                            message: "Username is required",
                                        },
                                    })}
                                    onFocus={(e) => {
                                        if (e.target.value === "")
                                            setUsernameValid(true);
                                    }}
                                    onBlur={(e) => {
                                        if (e.target.value === "")
                                            setUsernameValid(false);
                                    }}
                                    type="text"
                                    name="username"
                                />
                                <label>username</label>
                                <i className="fa-regular fa-user" />
                                <span
                                    className={`input-error ${
                                        errors?.username ? "show" : ""
                                    }`}
                                >
                                    {errors.username?.message}
                                </span>
                            </div>
                            <div
                                className={`input-field ${
                                    passwordVlaid ? "valid" : ""
                                }`}
                            >
                                <input
                                    {...register("password", {
                                        required: {
                                            value: true,
                                            message: "Password is required",
                                        },
                                    })}
                                    onFocus={(e) => {
                                        if (e.target.value === "")
                                            setPasswordValid(true);
                                    }}
                                    onBlur={(e) => {
                                        if (e.target.value === "")
                                            setPasswordValid(false);
                                    }}
                                    type={passwordInputType}
                                    name="password"
                                />
                                <label>password</label>
                                <i className="fa-regular fa-lock" />
                                <i
                                    className={`fa-regular fa-eye${
                                        passwordInputType === "text"
                                            ? "-slash"
                                            : ""
                                    } btn-eye`}
                                    onClick={() =>
                                        setPasswordInputType(
                                            passwordInputType === "text"
                                                ? "password"
                                                : "text"
                                        )
                                    }
                                />

                                <span
                                    className={`input-error ${
                                        errors?.password ? "show" : ""
                                    }`}
                                >
                                    {errors.password?.message}
                                </span>
                            </div>
                            <div className="input-field center">
                                <Button buttonStyle="btn btn--primary">
                                    Login
                                </Button>
                            </div>
                            <hr />
                            <div className="input-field">
                                <p>
                                    I don't have an account?
                                    <Link to="/register">Register</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
