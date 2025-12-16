"use strict";
import { useNavigate } from "react-router-dom";


export default function HomeView() {
    const navigate = useNavigate();
    const redirect = () => {
        navigate("/login", { replace: true });
    }
    return (
        <>
            <h1>Home</h1>
            <button onClick={redirect}>
                gå tillbaks
            </button>
        </>
    );
}