"use strict";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CreditCard, Wallet } from "lucide-react";

import TopBar from "../components/TopBar";
import Navigation from "../components/NavigationBar";

import { useAuth } from "../components/AuthProvider";

import "../assets/accountView.css";

export default function AccountView() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleHome = () => {
        navigate('/', { replace: true })
    }

    const handleTopBarCallback = () => {
        navigate('/', { replace: true })
    }

    const handlePaymentMethod = () => {
        console.log("payment")
    }

    const handleAddBalanceMethod = () => {

    }

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
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

                    <div className="Account-info">
                        <div className="Account-spacer" />
                        <div className="Account-header">
                            <h1>Aktiv betalningsmetod</h1>

                            <div className="payment-method" onClick={handlePaymentMethod}>
                                <div className="payment-left">
                                    <span className="payment-icon"><CreditCard /></span>
                                    <span className="payment-name">Metods namn här</span>
                                </div>

                                <span className="payment-arrow">›</span>
                            </div>
                        </div>

                        <div className="Account-body">
                            <div className="details-card">
                                <div>
                                    <h1>Ditt saldo <Wallet /></h1>
                                </div>

                                <div className="details-card-saldo">
                                    <p>123 000:-</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="account-buttons">
                        <div className="account-buttons-body">
                            <button className="logout-button" onClick={handleAddBalanceMethod}>Lägg till i saldo</button>
                            <button className="logout-button" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
                <div className="navigation">
                    <Navigation />
                </div>
            </div>
        </>
    );
}
