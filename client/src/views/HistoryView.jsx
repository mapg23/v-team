"use strict";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TopBar from "../components/TopBar";
import Navigation from "../components/NavigationBar";

import TripsModel from "../models/TripsModel";

import "../assets/historyView.css";


export default function HistoryView() {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);


    const topBarCallback = () => {
        navigate('/', { replace: true });
    }

    const navigateToTrip = (id) => {
        console.log(id);
    }

    function formatDate(date) {
        return new Intl.DateTimeFormat("sv-SE")
            .format(new Date(date))
    }

    function calcDuration(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        const diffMs = end - start;

        const min = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(min / 60)
        const minutes = min % 60;

        return `${hours} Hours ${minutes} minutes.`;
    }

    async function fetchData() {
        setTrips(await TripsModel.getTripsByID(1)) // Ändra till riktigt id
        setLoading(false);
    }
    console.log(trips);

    useEffect(() => {
        if (trips.length === 0) {
            fetchData();
        }
    });

    if (loading) return (
        <>
            <h1>Loading...</h1>
        </>
    );



    return (
        <>
            <div className="layout">

                <TopBar
                    title="Historik"
                    callback={topBarCallback}
                    canCallback="yes"
                />

                <div className="history-wrapper">
                    {trips.map(trip => (
                        <div className="History-body" key={trip.id}>
                            <button
                                className="history-button"
                                onClick={() => navigateToTrip(trip.id)}
                                tabIndex={0}
                                role="button"
                            >

                                <div className="History-card">
                                    <div>
                                        <h1 className="history-title">Trip: #{trip.id} <em className="history-date"> {
                                            formatDate(trip.start_time)
                                        }</em>
                                        </h1>
                                    </div>

                                    <div className="History-card-body">
                                        <p>
                                            Duration: {calcDuration(trip.start_time, trip.end_time)}
                                            <br />
                                            Cost: {trip.cost} Kr
                                            <br />
                                            <span className="history-">Click for more information.</span>
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    ))}

                    {trips.map(trip => (
                        <div className="History-body" key={trip.id}>
                            <button
                                className="history-button"
                                onClick={() => navigateToTrip(trip.id)}
                                tabIndex={0}
                                role="button"
                            >

                                <div className="History-card">
                                    <div>
                                        <h1 className="history-title">Trip: #{trip.id} <em className="history-date"> {
                                            formatDate(trip.start_time)
                                        }</em>
                                        </h1>
                                    </div>

                                    <div className="History-card-body">
                                        <p>
                                            Duration: {calcDuration(trip.start_time, trip.end_time)}
                                            <br />
                                            Cost: {trip.cost} Kr
                                            <br />

                                            <span className="history-more">Click for more information.</span>
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="navigation">
                    <Navigation />
                </div>
            </div>


        </>
    );
}