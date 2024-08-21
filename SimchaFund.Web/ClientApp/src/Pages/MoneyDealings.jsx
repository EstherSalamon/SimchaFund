import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaCheck } from "react-icons/fa";
import Form from "react-bootstrap/form";

const MoneyDealings = () => {

    const { simchaid } = useParams();
    const navigate = useNavigate();
    const [simcha, setSimcha] = useState({});
    const [contributors, setContributors] = useState([]);

    useEffect(() => {

        const loadData = async () => {
            const { data } = await axios.get(`/api/simchos/everything?id=${simchaid}`);
            setContributors(data);
            loadSimcha();
        };

        const loadSimcha = async () => {
            const { data } = await axios.get(`/api/simchos/byid?id=${simchaid}`);
            setSimcha(data);
        };

        loadData();

    }, []);

    const onCheckChange = (e, index) => {
        const copy = [...contributors];
        let { contribute } = copy[index];
        if (copy[index].contribute) {
            contribute = false;
        } else {
            contribute = true;
        }
        copy[index].contribute = contribute;
        setContributors(copy);
    };

    const onValueChange = (e, index) => {
        const copy = [...contributors];
        copy[index].amount = e.target.value;
        setContributors(copy);
    };

    function formatDate(string) {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([], options);
    };

    const onButtonClick = async () => {
        const actions = [];
        contributors.forEach(c => {
            if (c.contribute) {
                const push = {
                    contributorId: c.controId,
                    name: `Contribution to the ${simcha.name} Simcha`,
                    simchaId: simchaid,
                    amount: c.amount
                };
                actions.push(push);
            }
        });
        await axios.post('/api/simchos/update', { Actions: actions, SimchaId: simcha.id });
        navigate('/');
    };

        return (
            <div className='container' style={{ marginTop: 80 }}>
                <h1>Contributions for the {simcha.name} Simcha</h1>
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
                        {contributors && contributors.map((c, index) =>
                            <tr key={c.controId}>
                                <td>
                                    <Form>
                                        <Form.Check type='switch' id='contribute' checked={c.contribute} onChange={e => onCheckChange(e, index)} />
                                    </Form>
                                </td>
                                <td>{c.name}</td>
                                <td>${c.balance}</td>
                                <td>{c.alwaysInclude ? <FaCheck/> : ''}</td>
                                <td>
                                    <div className='row'>
                                        <div className='col-md-1'>
                                            <label htmlFor='amount'>$</label>
                                        </div>
                                        <div className='col-md-11'>
                                            <input type='text' name='amount' placeholder='Amount' className='form-control' value={c.amount} onChange={e => onValueChange(e, index)} />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className='col-md-4 offset-4'>
                    <button className='btn btn-success w-100' onClick={onButtonClick}>Update</button>
                </div>
            </div>
        )    
};

export default MoneyDealings;