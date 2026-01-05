"use strict";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MapModel from "../models/MapModel";

import Map from "../components/Map-component";
import TopBar from "../components/TopBar";
import Navigation from "../components/NavigationBar";
import { socket } from "../components/socket";

import { useAuth } from "../components/AuthProvider";


export default function HomeView() {
    const navigate = useNavigate();
    const params = useParams();
    const cityId = 1; // Change to param

    const [loading, setLoading] = useState(true);

    const [bikes, setBikes] = useState([]);
    const [parkingZones, setParkingZones] = useState([]);
    const [chargingZones, setChargingZones] = useState([]);

    const [cityDetails, setcityDetails] = useState({
        id: null,
        name: null,
        latitude: null,
        longitude: null,
        bike_count: null,
    });

    const [bikeStatusMap, setBikeStatusMap] = useState({
        available: null,
        used: null
    });

    function rentBike(id) {
        console.log(`Hyr cykel med id: ${id}`)

        navigate(`/bike/${id}`, { replace: true });
    }

    function updateBikes(allBikes) {
        const bikesInCity = allBikes.filter((bike) => bike.city_id === Number(cityId));
        setBikes(bikesInCity);
        updateBikeStatus(bikesInCity);
    }

    function updateBikeStatus(bikes) {
        const availableCount = bikes.filter((bike) => bike.occupied === 10).length;
        const usedCount = bikes.length - availableCount;

        setBikeStatusMap((prev) => {
            if (prev.available === availableCount && prev.used === usedCount) {
                return prev;
            }

            return {
                available: availableCount,
                used: usedCount,
            };
        });
    }

    function topBarCallback() {

    }

    useEffect(() => {
        const onBikes = (data) => {
            updateBikes(data);
        };

        const onConnect = () => {
            console.log("socket connected", socket.id);
        };

        socket.on("connect", onConnect);
        socket.on("bikes", onBikes);

        return () => {
            socket.off("connect", onConnect);
            socket.off("bikes", onBikes);
        };
    }, [updateBikes]);



    useEffect(() => {
        async function fetchData() {
            let details = await MapModel.getCityDetailsByID(cityId);

            if (details.id = cityId) {
                setcityDetails(details)
                setLoading(false);
            }
        }
        fetchData();

    }, [cityId]);

    useEffect(() => {
        console.log(bikes);
    })

    const redirect = () => {
        navigate("/login", { replace: true });
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
                    title="Karta"
                    callback={topBarCallback}
                    canCallback="no"
                />

                <div className="map-wrapper">
                    <Map
                        coords={cityDetails}
                        bikes={bikes}
                        parkingZones={parkingZones}
                        chargingZones={chargingZones}
                        bikeRentCallback={rentBike}
                    />
                </div>

                <div className="navigation">
                    <Navigation />
                </div>
            </div>


        </>
    );
}