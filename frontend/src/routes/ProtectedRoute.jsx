import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectAuthLoading } from "../features/auth/authSelectors";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);

  if(loading){
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
