import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Contributions = () => {

    const { simchaid } = useParams();
    const [simcha, setSimcha] = useState({
        id: '',
        name: ''
    });
    const [allContros, setAllContros] = useState([{}]);
    const [didContros, setDidContros] = useState([]);

    const seeData = () => {
        console.log('these are all: ' + allContros);
        console.log(allContros);
        console.log('these are specifics: ' + didContros);
        console.log(didContros);
        console.log(simcha);
    }

    useEffect(() => {

        const loadData = async () => {
            const { data } = await axios.get('/api/contributors/get');
            setAllContros(data.Contributions); //doesnt work?
            const { data2 } = await axios.get('/api/simchos/actionsbyid', simchaid);
            setDidContros(data2);
            const { data3 } = await axios.get('/api/simchos/byid', simchaid);
            setSimcha(data3);
        };

        loadData();
        seeData();

    }, []);



    return (
        <div className='container' style={{marginTop: 80} }>
            <h1>Contributions for the -{ }- Simcha</h1>
            <table className='table table-striped table-hover'>
                <thead>
                    <tr>
                        <th>Contribute</th>
                        <th>Name</th>
                        <th>Balance</th>
                        <th>Always Include</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {allContros && allContros.map(a => 
                        <tr key={'1'}>
                            <td>
                                <input type='checkbox' name='include' className='form-control'/>
                            </td>
                            <td>{a.name}</td>
                            <td>{a.balance}</td>
                            <td>{a.alwaysInclude}</td>
                            <td>
                                <input type='text' value='5' readOnly placeholder='Amount' className='form-control w-100' />
                            </td>
                        </tr>)}
                </tbody>
            </table>
        </div>
    )

};

export default Contributions;