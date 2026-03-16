import AppRouter from "./routes/AppRouter";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMe } from "./features/auth/authSlice";
import socket from "./services/socket";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe())
      .unwrap()
      .then(() => socket.connect())
      .catch(() => {});
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
  return <AppRouter />;
};

export default App;
