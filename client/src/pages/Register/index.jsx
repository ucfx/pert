import "styles/layout/form.css";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useRegister from "hooks/useRegister";
import { useToast, Button } from "@chakra-ui/react";

const Login = () => {
    const [passwordInputType, setPasswordInputType] = useState("password");
    const [usernameVlaid, setUsernameValid] = useState(false);
    const [passwordVlaid, setPasswordValid] = useState(false);
    const [cnfPasswordVlaid, setCnfPasswordValid] = useState(false);

    const navigate = useNavigate();
    const {
        setValue,
        setError,
        watch,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const resetForm = () => {
        reset();
        setUsernameValid(false);
        setPasswordValid(false);
        setCnfPasswordValid(false);
        setPasswordInputType("password");
        document.activeElement.blur();
    };

    const toast = useToast({ position: "top" });

    const { register: signup, isLoading, error } = useRegister();

    const handleRegister = (data) => {
        toast.closeAll();
        toast.promise(signup(data), {
            loading: {
                title: "Creating account...",
                description: "Please wait.",
            },
            success: () => {
                resetForm();
                setTimeout(() => {
                    navigate("/login");
                }, 500);
                return {
                    title: "Account created.",
                    description: "Login now!",
                    duration: 1500,
                    colorScheme: "purple",
                };
            },
            error: () => {
                return {
                    title: "An error occurred.",
                    description: "Something went wrong!",
                    duration: 3000,
                };
            },
        });
    };
    useEffect(() => {
        if (error) {
            console.log("register error: ", error);
            Object.keys(error).forEach((key) => {
                setError(key, {
                    type: "manual",
                    message: error[key],
                });
            });
        }
    }, [error]);

    const validateUsername = (value) => {
        if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(value) && value !== "") {
            return "Must start with a letter";
        } else if (value.trim().length < 2) {
            return "Username must be at least 2 characters long";
        }
    };

    const validatePassword = (value) => {
        if (value.length < 0) {
            return "Password must be at least 6 characters";
        }
    };

    const validateCnfPassword = (value, target) => {
        if (value !== watch(target)) {
            setError("cnfPassword", {
                type: "manual",
                message: "The passwords do not match",
            });
        } else {
            setError("cnfPassword", {
                type: "manual",
                message: "",
            });
        }
    };

    const onError = (errors) => {
        console.log(errors);
    };

    return (
        <div className="login">
            <div className="container">
                <div className="form-container">
                    <div className="form-content">
                        <h1>Register</h1>
                        <form onSubmit={handleSubmit(handleRegister, onError)}>
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
                                        pattern: {
                                            value: /^[a-zA-Z][a-zA-Z0-9]*$/,
                                            message: "Must start with a letter",
                                        },

                                        onChange: (e) =>
                                            setValue(
                                                "username",
                                                e.target.value
                                                    .toLowerCase()
                                                    .replace(/\s/g, "")
                                            ),
                                        validate: validateUsername,
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
                                        validate: validatePassword,
                                        onChange: (e) => {
                                            validateCnfPassword(
                                                e.target.value,
                                                "cnfPassword"
                                            );
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
                            <div
                                className={`input-field ${
                                    cnfPasswordVlaid ? "valid" : ""
                                }`}
                            >
                                <input
                                    {...register("cnfPassword", {
                                        required: {
                                            value: true,
                                            message: "Password is required",
                                        },
                                        validate: (value) =>
                                            value === watch("password") ||
                                            "The passwords do not match",
                                        onChange: (e) => {
                                            validateCnfPassword(
                                                e.target.value,
                                                "password"
                                            );
                                        },
                                    })}
                                    onFocus={(e) => {
                                        if (e.target.value === "")
                                            setCnfPasswordValid(true);
                                    }}
                                    onBlur={(e) => {
                                        if (e.target.value === "")
                                            setCnfPasswordValid(false);
                                    }}
                                    type={passwordInputType}
                                    name="cnfPassword"
                                />
                                <label>confirm password</label>
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
                                        errors?.cnfPassword ? "show" : ""
                                    }`}
                                >
                                    {errors.cnfPassword?.message}
                                </span>
                            </div>
                            <div className="input-field center">
                                <Button
                                    isLoading={isLoading}
                                    loadingText="Signing up..."
                                    colorScheme="purple"
                                    type="submit"
                                >
                                    Sign up
                                </Button>
                            </div>
                            <hr />
                            <div className="input-field">
                                <p>
                                    Already have an account?
                                    <Link to="/login">Login</Link>
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
