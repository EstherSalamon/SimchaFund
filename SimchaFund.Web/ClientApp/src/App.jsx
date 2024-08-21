import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './Pages/Home';
import Simchos from './Pages/Simchos';
import Contributors from './Pages/Contributors';
import History from './Pages/History';
import MoneyDealings from './Pages/MoneyDealings';

const App = () => {
    return (
        <Layout>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/simchos' element={<Simchos />} />
                <Route path='/contributors' element={<Contributors />} />
                <Route path='/history/:userid' element={<History />} />
                <Route path='/contributions/:simchaid' element={<MoneyDealings />} />
            </Routes>
        </Layout>
    );
}

export default App;