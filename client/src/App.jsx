import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
const Loader = lazy(() => import("components/Loader"));
const Login = lazy(() => import("pages/Login"));
const Register = lazy(() => import("pages/Register"));
const Dashboard = lazy(() => import("pages/Dashboard"));
const PertChart = lazy(() => import("./components/PertChart"));
import useAuth from "hooks/useAuth";

import { useState } from "react";

function App() {
    const [data, setData] = useState([
        // { key: 0, length: 0, text: "Start" },
        { key: 1, length: 6, text: "A", dependsOn: [5] },
        { key: 2, length: 5, text: "B", dependsOn: [10, 5] },
        { key: 3, length: 1, text: "C" },
        { key: 4, length: 1, text: "D" },
        { key: 5, length: 2, text: "E" },
        { key: 6, length: 6, text: "F", dependsOn: [4] },
        { key: 7, length: 3, text: "G", dependsOn: [6, 4] },
        { key: 8, length: 4, text: "H", dependsOn: [1, 3, 4] },
        {
            key: 9,
            length: 1,
            text: "I",
            dependsOn: [8, 1, 3, 4, 5, 11, 6],
        },
        { key: 10, length: 4, text: "J", dependsOn: [5] },
        { key: 11, length: 8, text: "K", dependsOn: [4, 6] },
    ]);

    let newData = [
        // { key: 0, length: 0, text: "Start" },
        { key: 1, length: 10, text: "A", dependsOn: [5] },
        { key: 2, length: 5, text: "B", dependsOn: [10, 5] },
        { key: 3, length: 1, text: "C" },
        { key: 4, length: 1, text: "D" },
        { key: 5, length: 2, text: "E" },
        { key: 6, length: 6, text: "F", dependsOn: [4] },
        { key: 7, length: 3, text: "G", dependsOn: [6, 4] },
        { key: 8, length: 4, text: "H", dependsOn: [1, 3, 4] },
        {
            key: 9,
            length: 1,
            text: "I",
            dependsOn: [8, 1, 3, 4, 5, 11, 6],
        },
        { key: 10, length: 4, text: "J", dependsOn: [5] },
        { key: 11, length: 8, text: "K", dependsOn: [4, 6] },
    ];
    const { user } = useAuth();
    return (
        <Suspense fallback={<Loader />}>
            <Router>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />}>
                        <Route element={<>Dashboard</>} index />
                    </Route>
                    <Route
                        path="/login"
                        element={
                            user ? (
                                <Navigate to="/" replace={true} />
                            ) : (
                                <Login />
                            )
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            user ? (
                                <Navigate to="/" replace={true} />
                            ) : (
                                <Register />
                            )
                        }
                    />
                    <Route
                        path="/pert"
                        element={
                            <>
                                <button onClick={() => setData(newData)}>
                                    Click me
                                </button>
                                <div
                                    className="pert-chart"
                                    style={{
                                        width: 800,
                                        height: 400,
                                    }}
                                >
                                    <PertChart
                                        data={data}
                                        containerWidth={800}
                                        containerHeight={400}
                                    />
                                </div>
                            </>
                        }
                    />
                </Routes>
            </Router>
        </Suspense>
    );
}

export default App;
/*

    <Route
                    path="/pert"
                    element={
                        <>
                            <button onClick={() => setData(newData)}>
                                Click me
                            </button>
                            <div
                                className="pert-chart"
                                style={{
                                    width: 800,
                                    height: 400,
                                }}
                            >
                                <PertChart
                                    data={data}
                                    containerWidth={800}
                                    containerHeight={400}
                                />
                            </div>
                        </>
                    }
                />
                */
