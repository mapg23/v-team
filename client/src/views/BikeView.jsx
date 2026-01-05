"use strict";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import Navigation from "../components/NavigationBar";

import BikeModel from "../models/BikeModel";

import { useAuth } from "../components/AuthProvider";

import TripsModel from "../models/TripsModel";

export default function BikeView() {
    const navigate = useNavigate();
    const params = useParams();
    const [bike, setBike] = useState(null);

    const { userId } = useAuth();

    const [loading, setLoading] = useState(true);
    const [inProgress, setInProgress] = useState(false);


    function topBarCallback() {
        navigate('/', { replace: true })
    }


    useEffect(() => {
        if (!bike) {
            setBike(params.id);
            setLoading(false)
        }
    })

    async function HandlestartTrip() {
        let res = await TripsModel.startTrip(userId, bike);

        if (res[0]['id'] !== null) {
            setInProgress(true);
        }
    }

    async function HandleStopTrip() {
        setInProgress(false)
    }

    if (loading) return (
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


                    {inProgress ? (
                        <>
                            <h1>In progress (Timer här) </h1>

                            <p>ID och annat här</p>

                            <button onClick={HandleStopTrip}>
                                Stop
                            </button>
                        </>
                    ) : (
                        <button onClick={HandlestartTrip}>
                            Start
                        </button>
                    )}


                </div>

                <div className="navigation">
                    <Navigation />
                </div>
            </div>


        </>
    );
}