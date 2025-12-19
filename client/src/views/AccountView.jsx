"use strict";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../components/TopBar";
import Navigation from "../components/NavigationBar";

import "../all.css";

export default function AccountView() {
    const navigate = useNavigate();

    const handleHome = () => {
        navigate('/');
    }

    const handleTopBarCallback = () => {

    }

    return (
        <>
            <div className="layout">

                <TopBar
                    title="Konto"
                    callback={handleTopBarCallback}
                    canCallback="yes"
                />

                <div className="content-wrapper">

                </div>


                <div className="navigation">
                    <Navigation />
                </div>
            </div>


        </>
    );
}
