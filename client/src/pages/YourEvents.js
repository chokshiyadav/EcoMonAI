import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../Context/auth";

import { useNavigate } from "react-router-dom";

import axios from "axios";
const YourEvents = () => {

  const backendUrl = window.location.hostname === 'localhost' ? 
  'http://localhost:3001' : 
  'http://192.168.49.2:30002'; 
  const navigate = useNavigate();

  const [auth] = useAuth();
  const [events, setEvents] = useState();
  const getYourEvents = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/v1/event/get-hostedEvents`
      );
      if (data?.success) {
        setEvents(data?.events);
      }
    } catch (error) {
    }
  };
  useEffect(() => {
    getYourEvents();
  }, []);

  return (
    <Layout>
      <h2 id="yourevents">Your Events</h2>
      <div className="container">
      <div className="row justify-content-start" >
      {events?.map((ev) => {
        let cd = new Date().getTime();
        let cd1 = new Date(ev.date);
        if (cd <= cd1.getTime()) {
          return (
            <>
            <div className="col-md-3 my-3" key={ev._id}>
              <div className="card" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5 className="card-title">{ev.title}</h5>
                  <p className="card-text">{ev.description}</p>
                  <p>Description:{ev.description}</p>
                  <p>Address:{ev.place}</p>
                  {
                    <p>
                      Date:{new Date(ev?.date).getFullYear()}-
                      {new Date(ev?.date).getMonth() + 1}-
                      {new Date(ev?.date).getDate()}
                    </p>
                  }
                  <p>Time: {ev.time}</p>
                  <button
                    className="btn btn-primary ms-2"
                    onClick={() => {
                      navigate(`/participantslist/${ev._id}`);
                    }}
                  >
                    Get Paticpants list
                  </button>
                </div>
              </div>
              </div>
            </>
          );
        }
      })}
      </div>
      </div>
    </Layout>
  );
};

export default YourEvents;
