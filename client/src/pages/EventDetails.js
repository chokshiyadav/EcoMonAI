import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
// import toast from 'react-hot-toast'
import axios from 'axios'
import { NavLink, useParams } from 'react-router-dom'

import { useAuth } from '../Context/auth.js'
import  toast  from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const EventDetails = () => {

  const backendUrl = window.location.hostname === 'localhost' ? 
  'http://localhost:3001' : 
  'http://192.168.49.2:30002'; 
  
  const params = useParams()
  const navigate = useNavigate()
  const [auth,setAuth] = useAuth()
  const [host,setHost] = useState(0)
  const [event,setEvent] = useState({
    title:"",
    description:"",
    place:"",
    date:"",
    organiser:null
  })
  useEffect(  ()=>{
    if(params?.title) getEvent();
     
   },[params?.title])
 
  const getEvent = async() => {
    try{

      const {data} = await axios.get(`${backendUrl}/api/v1/event/getOneEvent/${params.title}`)
      if(data?.success)
      {
         toast.success('events were fetched')
        setEvent(data?.event)
        if(auth?.user._id === data?.event?.organiser)
        {
          setHost(1)
        }
      }
      else
      {
       toast.error(data?.message)
      }

    }
    catch(error)
    {
      toast.error("something went wrong")
    }
  }
  
  const participate = async() =>{
    try{
      const dat = localStorage.getItem('auth')
        const {data} = await axios.put(`${backendUrl}/api/v1/auth/participate/${params.eid}`)

        if(data?.success)
        {
          toast.success(data?.message)
         // navigate('/yourparticipations');
        }
    }
    catch(error)
    {
      toast.error("something went wrong")
    }
  }
 
  return (
    <Layout>
      <div className="container" id="eventdetails">
        <h3 id="Event">{event?.title}</h3>
        <p><strong>Description : </strong>{event?.description}</p>
        <hr></hr>
        <p><strong>Address : </strong>{event?.place}</p>
        <hr></hr>
        <p><strong>Date : </strong>Date:{new Date(event?.date).getFullYear()}-{new Date(event?.date).getMonth()+1}-{new Date(event?.date).getDate()}</p>
        <hr></hr>
        <p><strong>Time: </strong>{event.time}</p>
        {host===0 ?  <><p>Want to participate in the above event? Click below</p> <button className='btn btn-primary' onClick={() => participate()}>Participate</button></> : <h5>You are the host for this event</h5>} 
        </div>
    </Layout>
  )
}

export default EventDetails