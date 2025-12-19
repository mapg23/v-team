"use strict";

/**
 * Function used to determine which device type is in use.
 * Without this porting to ios or android would not work.
 * @returns {String} - Url to API
 */
export function getApiBase() {
    // const host = window.location.hostname;

    // if (host === "localhost" || host === "127.0.0.1") {
    //     return "http://localhost:9091/api/v1";
    // }

    // if (host === "10.0.2.2") {
    //     return "http://10.0.2.2:9091/api/v1";
    // }

    // return `http://${host}:9091/api/v1`;

    return "/api/v1";

}