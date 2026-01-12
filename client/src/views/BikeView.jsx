"use strict";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import Navigation from "../components/NavigationBar";

import BikeModel from "../models/BikeModel";

import { useAuth } from "../components/AuthProvider";

import TripsModel from "../models/TripsModel";

import "../assets/bikeView.css";

export default function BikeView() {
    const navigate = useNavigate();
    const params = useParams();
    const [bike, setBike] = useState(null);
    const [tripObj, setTripObj] = useState([]);

    const { userId } = useAuth();

    const [loading, setLoading] = useState(true);
    const [inProgress, setInProgress] = useState(false);

    const [time, setTime] = useState(0);
    const [cost, setCost] = useState(0);

    const intervalRef = useRef(null);
    const startRef = useRef(null);


    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        return (
            String(mins).padStart(2, "0") +
            ":" +
            String(secs).padStart(2, "0")
        );
    }

    const start = () => {
        if (intervalRef.current) return;

        startRef.current = Date.now();

        intervalRef.current = setInterval(() => {
            const elapsedTime = (Date.now() - startRef.current) / 1000;
            setTime(elapsedTime);
        }, 250);
    };

    const stop = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    };

    const reset = () => {
        stop();
        setTime(0);
    }


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
        if (res) {
            setTripObj(res);
            setInProgress(true);
            reset();
            start();
        }
    }

    async function HandleStopTrip() {
        let res = await TripsModel.endTrip(bike);
        console.log(res);
        setInProgress(false)
        stop();
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
                            <div className="bike-in-progress">

                                <div className="bike-in-progress-header">

                                    <h1>{formatTime(time)}</h1>

                                    <p>
                                        Kostnad: {cost}
                                        <br />
                                        Cykel: ?
                                    </p>
                                </div>

                                <button onClick={HandleStopTrip}>
                                    Stop
                                </button>

                            </div>
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