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
  const [hasInit, setHasInit] = useState(false);
  const userId = Number(sessionStorage.getItem("userid"));


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

    console.log(`START: ${start}, |, END: ${end}`);
    const diffMs = end - start;

    const min = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(min / 60)
    const minutes = min % 60;

    return `${hours} Hours ${minutes} minutes.`;
  }

  async function fetchData() {
    setTrips(await TripsModel.getTripsByID(userId)) // Ändra till riktigt id
    setHasInit(true);
    setLoading(false);
  }
  console.log(trips);

  useEffect(() => {
    if (trips.length === 0 && !hasInit) {
      fetchData();
    }
  });

  if (loading) return (
    <>
      <h1>Loading...</h1>
    </>
  );

  if (!loading && hasInit && trips.length == 0) return (
    <>
      <div className="layout">

        <TopBar
          title="Historik"
          callback={topBarCallback}
          canCallback="yes"
        />

        <div className="history-wrapper">
          <div className="History-body">

            <div className="History-card">
              <div>
                <h1 className="history-title center">
                  No trips yet, come back after your first ride!
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="navigation">
          <Navigation />
        </div>
      </div>


    </>
  )



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
                  <div className="history-text">
                    <h1 className="history-title">Trip: #{trip.id}</h1> <span className="history-date"> {
                      formatDate(trip.start_time)
                    }</span>
                  </div>

                  <div className="History-card-body">
                    <p>
                      Duration: {calcDuration(trip.start_time, trip.end_time)}
                      <br />
                      Cost: {trip.cost} Kr
                      <br />
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