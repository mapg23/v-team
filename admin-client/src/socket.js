import { io } from "socket.io-client";

const URL = `http://localhost:9091`;

export const socket = io(URL, {
  path: "/socket.io",
  transports: ["polling"]
});
