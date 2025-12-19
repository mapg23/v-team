"use strict";
import { io } from "socket.io-client";

export const socket = io("api/v1", {
    path: "/socket.io",
    transports: ["polling"],
});