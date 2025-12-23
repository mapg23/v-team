"use strict";
import { io } from "socket.io-client";

export const socket = io("/", {
    path: "/socket.io",
    transports: ["polling"],
});