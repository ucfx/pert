import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login, Register } from "pages";
import { PertChart } from "./components";
import { useState } from "react";

function App() {
    const [data, setData] = useState([
        { key: 0, length: 0, text: "Start" },
        { key: 1, length: 6, text: "A", dependsOn: [5] },
        { key: 2, length: 5, text: "B", dependsOn: [10, 5] },
        { key: 3, length: 1, text: "C", dependsOn: [0] },
        { key: 4, length: 1, text: "D", dependsOn: [0] },
        { key: 5, length: 2, text: "E", dependsOn: [0] },
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
        { key: 0, length: 0, text: "Start" },
        { key: 1, length: 10, text: "A", dependsOn: [5] },
        { key: 2, length: 5, text: "B", dependsOn: [10, 5] },
        { key: 3, length: 1, text: "C", dependsOn: [0] },
        { key: 4, length: 1, text: "D", dependsOn: [0] },
        { key: 5, length: 2, text: "E", dependsOn: [0] },
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
    return (
        <Router>
            <Routes>
                <Route path="/" element={<>Home</>} />
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
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;
