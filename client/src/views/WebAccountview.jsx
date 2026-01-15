import "../assets/webAccountView.css";
import avatar from "../assets/avatar.png";

import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { use, useEffect, useState } from "react";

import UserModel from "../models/UserModel";

export default function WebAccountView() {
    const navigate = useNavigate();
    const { logout, userId, checkLoggedin, isLoggedIn } = useAuth();
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState({});

    const [balance, setBalance] = useState(0);
    const [trips, setTrips] = useState([]);

    function calcDuration(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        console.log(`START: ${start}, |, END: ${end}`);
        const diffMs = end - start;

        const min = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(min / 60)
        const minutes = min % 60;

        return `${hours} Hours ${minutes} minutes.`;
    }

    useEffect(() => {
        if (localStorage.getItem("isLoggedIn") != "true") {
            logout();
            navigate('/login', { replace: true });
            return;
        }

        const fetchData = async () => {

            try {
                let userFetch = await UserModel.getUserById(userId);
                let balanceFetch = await UserModel.getUserBalance(userId);
                let tripFetch = await UserModel.getTrips(userId);
                setUser(userFetch);
                setBalance(balanceFetch.balance)
                setTrips(tripFetch);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [userId]);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    }

    const handlePayment = () => {
        navigate('/pay', { replace: true });
    }

    const handleRemoveAccount = async () => {
        await UserModel.removeAccount(userId);
        logout();
        navigate('/login');
    }

    if (loading) return (
        <>
            <h1>Loading...</h1>
        </>
    );

    return (
        <>
            <div className="web-layout">
                <TopBar
                    title="Konto"
                    callback={function () { }}
                    canCallback="no"
                />

                <div className="web-content-wrapper">

                    <div className="web-top-panel">
                        <div className="web-top-avatar">
                            <img src={avatar} alt="Avatar" />
                        </div>

                        <div className="web-top-info">
                            <h1>Balance: {balance}:-</h1>
                            <p>
                                {user[0]['email']} <br />
                            </p>
                        </div>

                        <div className="web-top-actions">
                            <button onClick={handleLogout}>Logga ut</button>
                            <button onClick={handlePayment}>Lägg till pengar</button>
                            <button onClick={handleRemoveAccount}>Ta bort konto</button>
                        </div>
                    </div>


                    <div className="web-bottom-row">

                        <div className="web-bottom-col">
                            <h2 className="web-bottom-title">
                                Priser
                            </h2>

                            <p className="web-bottom-info">
                                (Baseras på zoner)
                            </p>
                            <ul className="price-list">
                                <li>
                                    <span>Startkostnad</span>
                                    <span>15/25:-</span>
                                </li>
                                <li>
                                    <span>Minutkostnad</span>
                                    <span>2.6/3.0 min</span>
                                </li>
                                <li>
                                    <span>Parkerings kostnad</span>
                                    <span>75/90:-</span>
                                </li>

                                <li>
                                    <span>Rabbat</span>
                                    <span>50%</span>
                                </li>
                            </ul>
                        </div>

                        <div className="web-bottom-col">
                            <h2 className="web-bottom-title">
                                Historik
                            </h2>

                            <p className="web-bottom-info">
                                (För mer info, använd applikationen)
                            </p>

                            <ul className="price-list">

                                {trips.map(trip => (

                                    <li key={trip.id}>
                                        <span> #{trip.id} | {trip.cost}:- </span>
                                        <span>{calcDuration(trip.start_time, trip.end_time)}</span>
                                    </li>
                                ))}
                            </ul>

                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}