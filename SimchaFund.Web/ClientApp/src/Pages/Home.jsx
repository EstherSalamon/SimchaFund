import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import '/Home.css';

const Home = () => {

    return (
        <div className='container' style={{ marginTop: 80 }}>
            <h1>I hear you're making a simcha! Mazel Tov!</h1>
            <h3>I'm assuming you're very busy, then. I won't waste your time. Just follow the links.</h3>
            <br />
            <br />
            <br/>
            <div className='row'>
                <div className='col-md-2 offset-3'>
                    <a href='/simchos' className='btn btn-outline-info w-100'>Simchos Page</a>
                </div>
                <div className='col-md-2 offset-1'>
                    <a href='/contributors' className='btn btn-outline-success w-100'>Contributors Page</a>
                </div>
            </div>
        </div>
    );
};

export default Home;