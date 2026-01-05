"use strict";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import Navigation from "../components/NavigationBar";

import BikeModel from "../models/BikeModel";

export default function BikeView() {
    const navigate = useNavigate();
    const params = useParams();
    const bikeId = 0;

    const [loading, setLoading] = useState(true);

    function topBarCallback() {
        navigate('/', { replace: true })
    }


    useEffect(() => {
        console.log(params.id);
    })

    if (!loading) return (
        <>
            <h1>Loading...</h1>
        </>
    );

    return (
        <>
            <div className="layout">

                <TopBar
                    title="Bike"
                    callback={topBarCallback}
                    canCallback="yes"
                />

                <div className="map-wrapper">
                </div>

                <div className="navigation">
                    <Navigation />
                </div>
            </div>


        </>
    );
}