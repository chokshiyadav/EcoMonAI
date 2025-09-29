import React, { useState,useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'

import { useParams } from 'react-router-dom'

const ParticipantsList = () => {

    const backendUrl = window.location.hostname === 'localhost' ? 
    'http://localhost:3001' : 
    'http://192.168.49.2:30002'; 

    const params = useParams()
    const [users,setUsers] = useState()
    const getUsers = async() => {
        try{
            const {data} = await axios.get(`${backendUrl}/api/v1/event/geteventusers/${params.eid}`);
            if(data?.success)
            {
                console.log(data);
                setUsers(data?.eventUsers)
            }
        }
        catch(error)
        {
        }
    }
    useEffect(()=>{
        getUsers();
    },[])
    console.log(users);
  return (
    <Layout>
        <h3>Paricpants List</h3>
        <div className='border shadow'>
            <table className='table'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                {
                            users?.map((u,i) => {
                                return (
                                    <tr>
                                        <td>{i+1}</td>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.phone}</td>
                                    </tr>
                                );
                            })
                        }
                </tbody>
            </table>

        </div>
        
    </Layout>
  )
}

export default ParticipantsList