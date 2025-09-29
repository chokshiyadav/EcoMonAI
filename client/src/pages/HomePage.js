import React from "react";
import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";

const HomePage = () => {
  const handleDashboardClick = async () => {
    try {
      // Call backend API to trigger InfluxDB data push
      await fetch("http://localhost:3001/push-to-influx", { method: "POST" });

    } catch (error) {
      console.error("Error triggering InfluxDB push:", error);
    }
  };

  return (
    <Layout>
      <div className="hp">
        <h2 id="title">Want to book any event or host an event??</h2>
        <h4 id="subtitle">Sign Up for free and join our community!!</h4>

        <div className="row">
          <div className="col">
            <Link to="/ongoingevents" className="text-decoration-none">
              <div className="card" id="firstimage" style={{ width: "20rem", height: "20rem" }}>
                <img src="./ongoingevents.jpg" className="card-img-top" alt="..." style={{ width: "20rem", height: "15rem" }} />
                <div className="card-body">
                  <h5 className="card-title" id="cardtitle">Up coming events</h5>
                  <p className="card-text" id="carddesc">Check all the events happening</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col">
            <Link to="/yourparticipations" className="text-decoration-none">
              <div className="card" id="secondimage" style={{ width: "20rem", height: "20rem" }}>
                <img src="./yourparticipations.jpg" className="card-img-top" alt="..." style={{ width: "20rem", height: "15rem" }} />
                <div className="card-body">
                  <h5 className="card-title" id="cardtitle">Your Participations</h5>
                  <p className="card-text" id="carddesc">Check all the events you participated</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Link to="/hostanevent" className="text-decoration-none">
              <div className="card" id="thirdimage" style={{ width: "20rem", height: "20rem" }}>
                <img src="./hostanevent.avif" className="card-img-top" alt="..." style={{ width: "20rem", height: "15rem" }} />
                <div className="card-body">
                  <h5 className="card-title" id="cardtitle">HOST AN EVENT</h5>
                  <p className="card-text" id="carddesc">Want to host an event!</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col">
            <Link to="/yourevents" className="text-decoration-none">
              <div className="card" id="fourthimage" style={{ width: "20rem", height: "20rem" }}>
                <img src="./yourevents.jpg" className="card-img-top" alt="..." style={{ width: "20rem", height: "15rem" }} />
                <div className="card-body">
                  <h5 className="card-title" id="cardtitle">YOUR EVENTS</h5>
                  <p className="card-text" id="carddesc">See the events you participated</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Dashboard Button */}
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={handleDashboardClick}>
            Push Data & Open Grafana
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
