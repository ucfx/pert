import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login, Register } from "pages";

function App() {
    console.log("Button");
    return (
        <Router>
            <Routes>
                <Route path="/" element={<>Home</>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;
