"use strict";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CreditCard, Wallet } from "lucide-react";

import TopBar from "../components/TopBar";
import Navigation from "../components/NavigationBar";

import "../assets/accountView.css";

export default function AccountView() {
    const navigate = useNavigate();

    const handleHome = () => {
        navigate('/', { replace: true })
    }

    const handleTopBarCallback = () => {
        navigate('/', { replace: true })
    }

    const handlePaymentMethod = () => {
        console.log("payment")
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
                                <h1>Ditt saldo</h1>

                            </div>

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
