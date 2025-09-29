import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const updateName = (e) => {
    setName(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updatePhone = (e) => {
    setPhone(e.target.value);
  };
  const backendUrl = window.location.hostname === 'localhost' ? 
  'http://localhost:3001' : 
  'http://192.168.49.2:30002'; 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/v1/auth/register`, {
        name,
        email,
        password,
        phone,
      });
      
      if (res.data.success) {
        alert('User registered successfully');
        navigate('/login');
      } else {
        alert('Failure while registering');
      }
    } catch (error) {
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="box2">
          <form onSubmit={handleSubmit}>
            <h2>SignUp</h2>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="exampleInputName"
                aria-describedby="nameHelp"
                placeholder="Name"
                value={name}
                onChange={updateName}
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Email"
                value={email}
                onChange={updateEmail}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Set Password"
                value={password}
                onChange={updatePassword}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="exampleInputPhno"
                aria-describedby="PHnoHelp"
                placeholder="Phone Number"
                value={phone}
                onChange={updatePhone}
              />
            </div>
            <button
              type="submit"
              id="submit"
              className="btn btn-primary my-3"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SignUpPage;
