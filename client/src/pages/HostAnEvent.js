import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/auth';
import toast from 'react-hot-toast';

const HostAnEvent = () => {

  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [place,setPlace] = useState("");
  const [date,setDate] = useState("");
  const [auth,setAuth] = useAuth();
  const [time,setTime] = useState()
  const navigate = useNavigate();


  const backendUrl = window.location.hostname === 'localhost' ? 
  'http://localhost:3001' : 
  'http://192.168.49.2:30002'; 
  const handleSubmit = async(e) =>{
    e.preventDefault();
    let id = auth?.user?._id;
    try {
      const {data} = await axios.post(`${backendUrl}/api/v1/event/create-event`,{title,description,place,date,time});
      if (data?.success)
      {
        toast.success("Event created successfully");
        navigate("/");
      }
    } catch (error) {
    }
  }

  // const getAllUsers = async() =>{
  //   try {
  //     const {data} = await axios.get('http://localhost:8080/api/v1/auth/get-users');
  //     if (data?.success)
  //     {
  //       setUsers(users);
  //     }
  //   } catch (error) {
  //   }
  // }

  // useEffect(()=>{
  //   getAllUsers();
  // },[])

  return (
    <Layout>
        <div className='container4'>
          <div className='box4'>
        <h1 className='text-center'>Host An Event</h1>
        <form className='text-center'>
          {/* <div className='mb-3'>
          <Select bordered={false} placeholder="Select a user" size='large' showSearch
             className='form-select mb-3'
             onChange={(value) =>setCategory(value)}>
              {users?.map((c)=>(
                <Option key={c._id} value={c._id}>{c.name}</Option>
              ))}
            </Select>
          </div> */}
          <div className="mb-3">
            <input type="text" className="form-control" id="exampleInputTitle1"  value={title} placeholder='Enter title of the event'
            onChange={(e) =>{
              setTitle(e.target.value)
            }}/>
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" id="exampleInputDescription1"  value={description} placeholder='Enter description of the event'
            onChange={(e) =>{
              setDescription(e.target.value)
            }}/>
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" id="exampleInputPlace1"  value={place}placeholder='Enter place of the event'
            onChange={(e) =>{
              setPlace(e.target.value)
            }}/>
          </div>
          <div className="mb-3">
            <input type="date" className="form-control" id="exampleInputDate1"  value={date }placeholder='Enter date of the event'
            onChange={(e) =>{
              setDate(e.target.value)
            }}/>
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" id="exampleInputDate1"  value={time }placeholder='Enter starting time of the event'
            onChange={(e) =>{
              setTime(e.target.value)
            }}/>
          </div>
          <div className='mb-3'>
          <button type="submit" className="btn btn-primary col-md-3" onClick={handleSubmit}>Submit</button>
          </div>
        </form>
        </div>
        </div>
        <div className='container'>
        <h1 className='text-center'>Host An Event</h1>
        </div>
    </Layout>
  )
}

export default HostAnEvent;