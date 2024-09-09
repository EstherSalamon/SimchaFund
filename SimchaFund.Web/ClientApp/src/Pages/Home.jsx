import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {

    return (
        <div className='container' style={{ marginTop: 80 }}>
            <h1>Welcome to the SimchaFund Tracker</h1>
            <hr/>
            <h5>Aiming to eliminate SimchaFund Collecting since it was created, all those many moons ago. Good luck, and Mazel Tov!</h5>
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