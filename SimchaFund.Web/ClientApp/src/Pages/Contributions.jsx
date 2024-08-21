
//This is the page that doesn't work. I redid it as MoneyDealings and did the logic in C# instead.

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheck } from "react-icons/fa";
import Form from "react-bootstrap/form";
import Spinner from 'react-bootstrap/Spinner';

const Contributions = () => {

    const { simchaid } = useParams();
    const navigate = useNavigate();
    const [simcha, setSimcha] = useState({});
    const [contributors, setContributors] = useState([]);
    const [updatedContributors, setUpdatedContributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [didContribute, setDidContribute] = useState([{
        contributorId: '',
        amount: ''
    }]);

    useEffect(() => {

        const loadData = async () => {
            const { data } = await axios.get('/api/contributors/get');
            setContributors(data.Contributors);
            setLoading(false);
        };

        loadData();

    }, []);

    /*---chatgpt rewriting my useEffect; it also didn't work. WHERE AM I GOING WRONG?!?!?!?
    const loadData = async () => {
        try {
            const { data } = await axios.get('/api/contributors/get');
            setContributors(data.contributors);

            const array = data.contributors.map(a => ({
                ...a,
                amount: '',
                include: a.alwaysInclude,
            }));
            setUpdatedContributors(array);

            await loadSimcha();
            await loadPeople();

        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSimcha = async () => {
        try {
            const { data } = await axios.get(`/api/simchos/byid?id=${simchaid}`);
            if (!data) {
                navigate('/simchos');
                return;
            }
            setSimcha(data);
        } catch (error) {
            console.error('Error loading simcha:', error);
        }
    };

    const loadPeople = async () => {
        try {
            const { data } = await axios.get(`/api/simchos/actionsbyid?id=${simchaid}`);
            setDidContribute(data);
        } catch (error) {
            console.error('Error loading people:', error);
        }
    };

    useEffect(() => {
        setLoading(true);
        loadData();
    }, []); // Empty dependency array ensures this runs only once, on mount.*/

    const onAmountChange = (e, index) => {
        //const copy = [...updatedContributors];
        //copy[index].amount = e.target.value;
        //setUpdatedContributors(copy);
    };
    const makeItWork = async () => {
        const array = [...contributors];
        array.forEach((a) => {
            a.amount = '';
            a.include = a.alwaysInclude;
        });
        setUpdatedContributors(array);
    };
    const checkExistance = id => {
        const check = didContribute.map(d => d.contributorId).includes(id);
        if (check) {
            const { amount } = didContribute.find(d => d.contributorId === id);
            /*setTheValue(amount);*/
        }
    };

    return (
        <div className='container' style={{ marginTop: 80 }}>
            {loading ? <>
                <Spinner animation="grow" size="sm" variant="info" />
                <Spinner animation="grow" variant="info" />
                <h4>Give me a minute...</h4>
            </> : <>
                <h2>Contributions for the {simcha.name} simcha</h2>
                    <hr />
                    <button onClick={() => console.log(contributors)}>Dkljdf</button>
                <table className='table table-striped table-hover'>
                    <thead>
                        <tr>
                            <th>Contribute</th>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Balance</th>
                            <th>Always Include</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                        <tbody>
                            {contributors && contributors.map(c => {
                                <tr key={c.id}>
                                    <td>
                                        <Form>
                                            <Form.Check type='switch' id='contribute' checked={didContribute.map(d => d.contributorId).includes(c.id) || c.alwaysInclude} />
                                        </Form>
                                    </td>
                                    <td>{c.id}</td>
                                    <td>{c.firstName} {c.lastName}</td>
                                    <td>${c.balance}</td>
                                    <td>{c.alwaysInclude ? <FaCheck /> : ''}</td>
                                    <td>
                                        <input type='text' className='form-control' name='amount' id={`amount${c.id}`} placeholder='Amount' />
                                    </td>
                                </tr>
                            })}
                    </tbody>
                </table>
            </>}
        </div>
    )
};

export default Contributions;

/* const loadData = async () => {
const { data } = await axios.get('/api/contributors/get');
setContributors(data.contributors);

//const array = [...contributors];
//array.forEach((a) => {
//    a.amount = '';
//    a.include = a.alwaysInclude;
//});
//setUpdatedContributors(array);

//const wait = [];
//contributors.map(_ => {
//    const copy = {
//        name: '',
//        simchaId: '',
//        amount: '',
//        include: '',
//        alwaysInclude: '',
//        date: '',
//        contributorId: ''
//    };
//    wait.push(copy);
//});
//setUpdatedContributors(wait);
makeItWork();
loadSimcha();
loadPeople();
};
const loadSimcha = async () => {
const { data } = await axios.get(`/api/simchos/byid?id=${simchaid}`);
if (!data) {
navigate('/simchos');
}
setSimcha(data);
};
const loadPeople = async () => {
const { data } = await axios.get(`/api/simchos/actionsbyid?id=${simchaid}`);
setDidContribute(data);
};
useEffect(() => {
setLoading(true);
loadData();
setLoading(false);
console.log(contributors);
}, []);*/