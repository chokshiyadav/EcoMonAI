import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/auth';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Header = () => {
  const navigate = useNavigate();
  const [auth,setAuth] = useAuth();

  const handleLogout = (e)=>{
    e.preventDefault();
    setAuth({
      ...auth,
      user:null,
      token:''
    })
    localStorage.removeItem('auth');
    toast.success('logging out successful');
    navigate("/login");
  }

  return (
    <div>
      <div className="containerdemo">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <div>
              <p className='title'>Book my event</p>
            </div>
            <div className="d-flex justify-content-end me-3" id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item mx-3">
                  <div className="home">
                    <button className="nav-link active" onClick={() => navigate('/')}>HOME</button>
                  </div>
                </li>
                {!auth.user ? (<>
                  <li className="nav-item mx-3">
                  <div className="login">
                    <button className="nav-link" onClick={() => navigate('/login')}>LOGIN</button>
                  </div>
                </li>
                </>)
              :
              ( <li className="nav-item dropdown">
              <NavLink className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {auth?.user?.name}
              </NavLink>
              <ul className="dropdown-menu">
                <li><NavLink onClick={handleLogout} to="/login"className="nav-link" href="#">LOGOUT</NavLink></li>
                <li><NavLink to={`/ongoingevents`}className="dropdown-item" href="#">ONGOING EVENTS</NavLink></li>
                <li><NavLink to={`/yourparticipations`}className="dropdown-item" href="#">YOUR PARTICIPATIONS</NavLink></li>
                <li><NavLink to={`/hostanevent`}className="dropdown-item" href="#">HOST AN EVENT</NavLink></li>
              </ul>
              </li>
              )}
               
                <li className="nav-item mx-3">
                  <div className="about">
                    <button className="nav-link" onClick={() => navigate('/about')}>ABOUT</button>
                  </div>
                </li>
                {/* <li className="nav-item mx-3">
                  <div className="about">
                    <button className="nav-link" onClick={() => navigate('/dashboard')}>DASHBOARD</button>
                  </div>
                </li> */}
                <li className="nav-item mx-3">
                  <div className="signup">
                    <button className="nav-link" onClick={() => navigate('/signup')}>SIGNUP</button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;