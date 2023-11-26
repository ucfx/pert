import { Button } from "components";
import "./login.css";
const Login = () => {
    return (
        <div className="login-page">
            <Button
                buttonStyle={"btn--primary"}
                onClick={() => console.log("Login")}
            >
                login
            </Button>
        </div>
    );
};

export default Login;
