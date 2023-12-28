import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useParams,
    useLocation,
    Link,
} from "react-router-dom";
import { lazy, Suspense } from "react";
const Loader = lazy(() => import("components/Loader"));
const Login = lazy(() => import("pages/Login"));
const Register = lazy(() => import("pages/Register"));
const Projects = lazy(() => import("pages/Projects"));
const Settings = lazy(() => import("pages/Settings"));
const UserProfile = lazy(() => import("components/UserProfile"));
const PertChart = lazy(() => import("components/PertChart"));
const ProjectDetails = lazy(() => import("pages/Projects/ProjectDetails"));
const NotFound = lazy(() => import("components/NotFound"));
import useAuth from "hooks/useAuth";
const PageTitleProvider = lazy(() =>
    import("context/PageTitleContext").then((module) => {
        return { default: module.PageTitleProvider };
    })
);
const InfoProvider = lazy(() =>
    import("context/InfoContext").then((module) => {
        return { default: module.InfoProvider };
    })
);
const ProjectProvider = lazy(() =>
    import("context/ProjectContext").then((module) => {
        return { default: module.ProjectProvider };
    })
);
const ProjectDetailsProvider = lazy(() =>
    import("context/ProjectDetailsContext").then((module) => {
        return { default: module.ProjectDetailsProvider };
    })
);
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
        // <Suspense fallback={<Loader />}>
        <Router>
            <Routes>
                <Route
                    path="/:username"
                    element={
                        <Suspense fallback={<Loader />}>
                            <AuthRoute>
                                <PageTitleProvider>
                                    <InfoProvider>
                                        <UserProfile />
                                    </InfoProvider>
                                </PageTitleProvider>
                            </AuthRoute>
                        </Suspense>
                    }
                >
                    <Route
                        index
                        element={<Navigate to="projects" replace={true} />}
                    />
                    <Route
                        path="projects"
                        element={
                            <AuthRoute>
                                <ProjectProvider>
                                    <Suspense fallback={<Loader />}>
                                        <Projects />
                                    </Suspense>
                                </ProjectProvider>
                            </AuthRoute>
                        }
                    />
                    <Route
                        path="projects/:projectId"
                        element={
                            <Suspense fallback={<Loader />}>
                                <ProjectDetailsProvider>
                                    <ProjectDetails />
                                </ProjectDetailsProvider>
                            </Suspense>
                        }
                    />
                    <Route
                        path={"settings"}
                        element={
                            <AuthRoute>
                                <Suspense fallback={<Loader />}>
                                    <Settings />
                                </Suspense>
                            </AuthRoute>
                        }
                        index
                    />
                </Route>
                <Route
                    path="/login"
                    element={
                        user ? (
                            <Navigate to="/dashboard" replace={true} />
                        ) : (
                            <Suspense fallback={<Loader />}>
                                <Login />
                            </Suspense>
                        )
                    }
                />
                <Route
                    path="/register"
                    element={
                        user ? (
                            <Navigate to="/dashboard" replace={true} />
                        ) : (
                            <Suspense fallback={<Loader />}>
                                <Register />
                            </Suspense>
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
                <Route
                    path="/"
                    element={
                        <>
                            home <Link to="/login">login</Link>
                        </>
                    }
                />
                // 404
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
        // </Suspense>
    );
}

export default App;

const AuthRoute = ({ children }) => {
    const { user } = useAuth();
    const { username } = useParams();
    const { pathname } = useLocation();

    if (!user) {
        return <Navigate to="/login" replace={true} />;
    } else if (user.username !== username) {
        return (
            <Navigate
                to={pathname.replace(username, user.username)}
                replace={true}
            />
        );
    }

    return children;
};
