"use strict";
import { useEffect } from "react";
import Navigation from "../components/NavigationBar";

export default function AccountView() {

    return (
        <div className="d-flex flex-column min-vh-100 bg-white">
            {/* content */}
            <main className="flex-grow-1 px-3 pt-4">
                <h1>HÄR</h1>
                {/* ... */}
            </main>

            <Navigation />
        </div>
    );
}
