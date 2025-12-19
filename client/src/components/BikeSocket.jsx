import { useEffect } from "react";
import { io } from "socket.io-client";

let API = "api/v1"

export default function BikeSocket({ paramId, onUpdate }) {
    useEffect(() => {
        const socket = io("/", {
            path: "/socket.io",
            transports: ["polling"], // iOS compatible
        });

        socket.on("bikes", (data) => {
            onUpdate(data);
        });

        return () => {
            socket.disconnect();
        };
    }, [paramId, onUpdate]);

    return null;
}
