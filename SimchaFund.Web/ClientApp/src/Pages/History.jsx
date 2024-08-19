import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const History = () => {

    const [actions, setActions] = useState([]);
    const [contributor, setContributor] = useState({});
    const { userid } = useParams();
    const navigate = useNavigate();

    useEffect(() => {

        const loadHistory = async () => {
            const { data } = await axios.get(`/api/contributors/history?userid=${userid}`);
            if (!data.contributor) {
                navigate('/contributors');
            }
            setActions(data.allActions);
            setContributor(data.contributor);
        };

        loadHistory();

    }, []);

    function formatDate(string) {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([], options);
    };

    return (
        <div className='container' style={{ marginTop: 80 }}>
            <div className='row'>
                <div className='col-md-8 offset-2'>
                    <h3>History for {contributor.firstName} {contributor.lastName}</h3>
                    <hr />
                    {actions[0] == undefined ? <h1>{contributor.firstName} {contributor.lastName} has not committed anything to history yet.</h1> :
                    <table className='table table-striped table-hover'>
                        <thead>
                            <tr>
                                <th>Action</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {actions && actions.map(a => 
                                <tr key={a.id}>
                                    <td>{a.name}</td>
                                    <td>${a.amount}</td>
                                    <td>{formatDate(a.date)}</td>
                                </tr>
                            )}
                        </tbody>
                        </table>}
                    <br />
                    <a href='/contributors' className='btn btn-danger w-100'>Back to Contributors</a>
                </div>
            </div>
        </div>
    );
};

export default History;