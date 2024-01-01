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
import Table from "./components/Table";

import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";

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

function App() {
	const { user } = useAuth();
	return (
		// <Suspense fallback={<Loader />}>
		<MantineProvider forceColorScheme="dark">
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
						<Route index element={<Navigate to="projects" replace={true} />} />
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
					<Route path="/pert" element={<Table />} />
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
			<Navigate to={pathname.replace(username, user.username)} replace={true} />
		);
	}

	return children;
};
