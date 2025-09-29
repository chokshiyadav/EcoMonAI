import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../Context/auth";

import axios from "axios";
import toast from "react-hot-toast";

const YourParticipations = () => {
  const [events, setEvents] = useState([]);
  const [auth, setAuth] = useAuth();
  const backendUrl = window.location.hostname === 'localhost' ? 
  'http://localhost:3001' : 
  'http://192.168.49.2:30002'; 
  const getPEvents = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/v1/auth/your-participations`,
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if (data?.success) {
        setEvents(data?.events);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    getPEvents();
  }, []);

  const removeHandler = async (title) => {
    try{
      const {data} = await axios.delete(`${backendUrl}/api/v1/event/remove-event/${title}`,        {
        headers: {
          Authorization: auth?.token,
        },
      })
      if(data.success){
        toast.success("Deleted successfully");
        getPEvents();
      }
    }catch(error){
    }
  }

  return (
    <>
      <Layout>
        <div className="your">
        <h1 id="yourpart">Your participations</h1>
        <div className="container">
        <div className="row">
        {events?.map((ev) => {
          return (
            <>
              <div className="col-md-3">
                <div className="card" style={{ width: "18rem"}}>
                  <div className="card-body">
                    <h5 className="card-title">{ev.title}</h5>
                    <p className="card-text">{ev.description}</p>
                    <p className="card-text">{ev.place}</p>
                    {<p>Date:{new Date(ev?.date).getFullYear()}-{new Date(ev?.date).getMonth()+1}-{new Date(ev?.date).getDate()}</p>}
                    <p className="card-text">Time:{ev.time}</p>
                    <button className="btn btn-primary" onClick={() => removeHandler(ev.title)}>Remove</button>
                  </div>

                </div>
              </div>
            </>
          );
        })}
        </div>
        </div>
        </div>
      </Layout>
    </>
  );
};

export default YourParticipations;
