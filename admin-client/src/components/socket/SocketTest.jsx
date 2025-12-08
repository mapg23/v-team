import { useEffect } from "react";
import { io } from "socket.io-client";

const API_PORT = import.meta.env.VITE_API_URL || "9091";

const URL = `http://localhost:${API_PORT}`;

export default function SocketTest() {
  useEffect(() => {
    const socket = io(URL);
    console.log(socket)

    socket.on("connect", () => {
      console.log("Connected! Socket ID:", socket.id);
    });

    socket.on("bike", (data) => {
      console.log("Received bike data:", data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Socket test</div>;
}
