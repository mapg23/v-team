"use strict";
import { useEffect } from "react";
import Navigation from "../components/NavigationBar";
import { useNavigate } from "react-router-dom";

export default function AccountView() {
    const navigate = useNavigate();

    const handleHome = () => {
        navigate('/');
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-white">
            {/* content */}
            <main className="flex-grow-1 px-3 pt-4">
                <button onClick={handleHome}>
                    Gå till home
                </button>
                <Navigation />
            </main>


        </div>
    );
}
