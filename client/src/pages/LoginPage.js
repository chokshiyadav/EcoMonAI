import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useAuth } from '../Context/auth.js';


import toast from 'react-hot-toast'
const LoginPage = () => {

  const backendUrl = window.location.hostname === 'localhost' ? 
  'http://localhost:3001' : 
  'http://192.168.49.2:30002'; 
  const navigate = useNavigate();
  const [auth,setAuth] = useAuth() || {};
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('') 
  const handleSubmit = async (e) => {
    e.preventDefault()
      try{
        const res = await axios.post(`${backendUrl}/api/v1/auth/login`,{email,password})
        if(res.data.success)
        {
          setAuth({
            ...auth,
            user:res.data.user,
            token:res.data.token
        });
        localStorage.setItem('auth',JSON.stringify(res.data));
          navigate('/')
          toast.success("logged in successfully");
        }
        else{
           toast.error(res.data.message)
        }

      }
      catch(error){
        toast.error("something went wrong")
      }

      

  }

 
  return (
    <Layout>
      <div className="container">
        <div className="box">
          <form>
            <h2 class="head22">Log In</h2>
            <div className="mb-3">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email" />
            </div>
            <div className="mb-3">
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="form-control" id="exampleInputPassword1" placeholder="Password" />
            </div>
            <button type="submit" id="submit" className="btn btn-primary my-3" onClick={(e)=>handleSubmit(e)}>Submit</button>
          </form>
          <div className="notamem my-3">
            Not a member? <a href = "/signup" onClick={() => navigate('/signup')}>SignUp</a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;