import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { NavLink, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const backendUrl = window.location.hostname === 'localhost' ? 
'http://localhost:3001' : 
'http://192.168.49.2:30002'; 
const OngoingEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([
    {
      title: "",
      description: "",
      place: "",
      date: "",
      organiser: null,
    },
  ]);

  useEffect(() => {
    getAllEvents();
  }, []);

  const getAllEvents = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/v1/event/get-events`
      );
      if (data?.success) {
        toast.success("Events were fetched");
        setEvents(data?.events);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <h1 className="oe">OngoingEvents</h1>
      <div className="container">
      <div className="row justify-content-start" >
        {events.map((ev) => {
            let cd = new Date().getTime();
            let cd1 = new Date(ev.date);
            if(cd <= cd1.getTime()){
        return (
          <div className="col-md-3 my-3" key={ev._id}>
            <div className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">{ev.title}</h5>
                <p className="card-text">{ev.description}</p>
                <button
                  className="btn btn-primary ms-2" id="submit"
                  onClick={() =>
                    navigate(`/event-details/${ev.title}/${ev._id}`)
                  }
                >
                  SEE DETAILS
                </button>
              </div>
            </div>
          </div>
        )}})}
      </div>
</div>
    </Layout>
  );
};

export default OngoingEvents;
