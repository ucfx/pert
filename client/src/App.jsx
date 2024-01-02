import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useParams,
    useLocation,
    Link,
} from "react-router-dom";
import Login from "pages/Login";
import Register from "pages/Register";
import Projects from "pages/Projects";
import Settings from "pages/Settings";
import UserProfile from "components/UserProfile";
import ProjectDetails from "pages/Projects/ProjectDetails";
import NotFound from "components/NotFound";
import useAuth from "hooks/useAuth";
import Table from "./components/Table";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { PageTitleProvider } from "context/PageTitleContext";
import { InfoProvider } from "context/InfoContext";
import { ProjectProvider } from "context/ProjectContext";
import { ProjectDetailsProvider } from "context/ProjectDetailsContext";

function App() {
    const { user } = useAuth();
    return (
        <MantineProvider forceColorScheme="dark">
            <Router>
                <Routes>
                    <Route
                        path="/:username"
                        element={
                            <AuthRoute>
                                <PageTitleProvider>
                                    <InfoProvider>
                                        <UserProfile />
                                    </InfoProvider>
                                </PageTitleProvider>
                            </AuthRoute>
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
                                        <Projects />
                                    </ProjectProvider>
                                </AuthRoute>
                            }
                        />
                        <Route
                            path="projects/:projectId"
                            element={
                                <ProjectDetailsProvider>
                                    <ProjectDetails />
                                </ProjectDetailsProvider>
                            }
                        />
                        <Route
                            path={"settings"}
                            element={
                                <AuthRoute>
                                    <Settings />
                                </AuthRoute>
                            }
                            index
                        />
                    </Route>
                    <Route
                        path="/login"
                        element={
                            user ? (
                                <Navigate
                                    to={`/${user.username}`}
                                    replace={true}
                                />
                            ) : (
                                <Login />
                            )
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            user ? (
                                <Navigate
                                    to={`/${user.username}`}
                                    replace={true}
                                />
                            ) : (
                                <Register />
                            )
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
                    404
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </MantineProvider>
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
