import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router";
import { AnimatePresence } from "motion/react";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getMe } from "../features/auth/authSlice";
import { selectIsAuthenticated } from "../features/auth/authSelectors";

import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home";
import Discover from "../pages/Discover";
import Library from "../pages/Library";
import Settings from "../pages/Settings";
import ProtectedRoute from "./ProtectedRoute";

// Redirects logged-in users away from auth pages
const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AnimatedRoutes = () => {
  const theme = useSelector((state) => state.theme.theme);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Main App Routes with Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="discover" element={<Discover />} />
          <Route path="library" element={<Library />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <ToastContainer/>
    </BrowserRouter>
  );
};

export default AppRouter;
