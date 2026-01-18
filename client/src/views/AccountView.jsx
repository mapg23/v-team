"use strict";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CreditCard, Wallet, LogOut } from "lucide-react";

import TopBar from "../components/TopBar";
import Navigation from "../components/NavigationBar";

import UserModel from "../models/UserModel";

import "../assets/accountView.css";

export default function AccountView({
  logoutcallback
}) {
  const navigate = useNavigate();

  const userId = Number(sessionStorage.getItem("userid"));
  const [balance, setBalance] = useState(null);
  const [account, setAccount] = useState([]);

  const handleHome = () => {
    navigate('/', { replace: true })
  }

  const handleTopBarCallback = () => {
    navigate('/', { replace: true })
  }

  const handleAddBalanceMethod = () => {
    navigate('/pay', { replace: true });
  }

  const handleLogout = () => {
    sessionStorage.clear();
    logoutcallback();
  }

  useEffect(() => {
    const fetchData = async () => {
      let accountData = await UserModel.getUserBalance(userId);
      setAccount(accountData);
      setBalance(accountData.balance);
    }
    fetchData();
  })


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
              <h1>Användare #{account.id}</h1>
            </div>

            <div className="Account-body">
              <div className="details-card">
                <div>
                  <h1>Ditt saldo <Wallet /></h1>
                </div>

                <div className="details-card-saldo">
                  <p>{balance}:-</p>
                </div>
              </div>
            </div>
          </div>
          <div className="account-buttons">
            <div className="account-buttons-body">
              <button className="logout-button" onClick={handleAddBalanceMethod}>
                Lägg till i saldo
              </button>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="navigation">
          <Navigation />
        </div>
      </div >
    </>
  );
}
