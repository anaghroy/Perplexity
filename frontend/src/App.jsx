import AppRouter from "./routes/AppRouter";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMe } from "./features/auth/authSlice";
import { appendChunk, streamingDone } from "./features/chat/chatSlice";
import socket from "./services/socket";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe())
      .unwrap()
      .then(() => socket.connect())
      .catch(() => {});

    socket.on("ai:chunk", ({ chunk }) => {
      dispatch(appendChunk(chunk));
    });

    socket.on("ai:done", ({ sources }) => {
      dispatch(streamingDone({ sources }));
    });

    socket.on("ai:error", ({ message }) => {
      console.error("AI streaming error:", message);
      dispatch(streamingDone({}));
    });

    return () => {
      socket.off("ai:chunk");
      socket.off("ai:done");
      socket.off("ai:error");
      socket.disconnect();
    };
  }, [dispatch]);

  return <AppRouter />;
};

export default App;
