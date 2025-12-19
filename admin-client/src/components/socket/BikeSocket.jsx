/**
 * DEPRECATED - USE SOCKET.JS INSTED
 */
import { useEffect } from "react";
import { io } from "socket.io-client";

const API_PORT = import.meta.env.VITE_API_URL || "9091";

const URL = `http://localhost:${API_PORT}`;

export default function BikeSocket({ paramId, onUpdate }) {
  useEffect(() => {
    const socket = io(URL);

    // socket.on("connect", () => {
    //   console.log("Connected! Socket ID:", socket.id);
    // });

    // Bike data
    socket.on("bikes", (data) => {
      onUpdate(data);
    });

    // socket.onAny((event, data) => {
    //   console.log("EVENT:", event, data);
    // });

    return () => {
      socket.disconnect();
    };
  }, [paramId]);

  return null;
}
