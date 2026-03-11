import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AnimatedRoutes = () => {
    const location = useLocation();
    
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </AnimatePresence>
    );
};

const AppRouter = () => {
    return (
        <BrowserRouter>
            <AnimatedRoutes />
        </BrowserRouter>
    );
};

export default AppRouter;
