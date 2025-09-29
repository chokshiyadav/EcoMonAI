import React from 'react'
import Layout from '../components/Layout/Layout'
// import img1 from '../img1.jpeg'
// import img2 from '../logo.jpeg'

const AboutPage = () => {
  return (
    <Layout>
        <div className='container'>
          <div>
            <h1 className='text-center' style={{color:'LightGreen',fontSize:50}}>About Us</h1>
          </div>
          <div style={{color:"white",fontSize:25}}>
          Our mission is to raise awareness and inspire action through the organization of rallies focused on environmental issues. 
          This platform joins people who are interested to participate in environment rallies and those who organise those events. 
          We believe that rallies are powerful catalysts for change. They provide a platform for individuals to voice their concerns, share knowledge, and express their dedication to environmental causes. 
          We hope that everyone makes use of this very efficiently and take steps towards protecting environment.
          </div>
          <h1  id="create" tyle={{color:'LightGreen',fontSize:50}}>Created By</h1>
          <div className='d-flex flex-wrap' id="aboutus" style={{color:'white'}}>
          <div className="card m-2" style={{width:18+'em'}}>
              {/* <img className="card-img-top" src="" alt="Card image cap"/> */}
              <div className="card-body">
                <h5 className="card-title">Akhil</h5>
                <p className="card-text">Full stack developer</p>              
              </div>
          </div>
          <div className="card m-2" style={{width:18+'em'}}>
              {/* <img className="card-img-top" src="" alt="Card image cap"/> */}
              <div className="card-body">
                <h5 className="card-title">Charan</h5>
                <p className="card-text">Full stack developer</p>              
              </div>
          </div>
          <div className="card m-2" style={{width:18+'em'}}>
              {/* <img className="card-img-top" src="" alt="Card image cap"/> */}
              <div className="card-body">
                <h5 className="card-title">Nikhil</h5>
                <p className="card-text">Full stack developer</p>              
              </div>
          </div>
          <div className="card m-2" style={{width:18+'em'}}>
              {/* <img className="card-img-top" src={img1} alt="Card image cap"/> */}
              <div className="card-body">
                <h5 className="card-title">Raghunadh</h5>
                <p className="card-text">Full stack developer</p>              
              </div>
          </div>
          </div>
        </div>
    </Layout>
  )
}

export default AboutPage