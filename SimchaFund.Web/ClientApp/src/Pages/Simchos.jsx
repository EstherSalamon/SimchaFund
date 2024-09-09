import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

const Simchos = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [simchos, setSimchos] = useState([]);
    const [showModal, setShow] = useState(false);
    const [newSimcha, setNewSimcha] = useState({
        name: '',
        date: ''
    });
    const [totalContributors, setTotal] = useState(0);

    const loadSimchos = async () => {
        setIsLoading(true);
        const { data } = await axios.get('/api/simchos/get');
        setSimchos(data.simchos);
        setTotal(data.totalContributors);
        setIsLoading(false);
    };

    useEffect(() => {

        loadSimchos();

    }, []);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onCancelClick = () => {
        handleClose();
        clearModal();
    };

    const clearModal = () => {
        setNewSimcha({
            name: '',
            date: ''
        });
    };

    const onSaveClick = async () => {
        await axios.post('/api/simchos/add', { simcha: newSimcha });
        handleClose();
        clearModal();
        loadSimchos();
    };

    const onValueChange = e => {
        const copy = { ...newSimcha };
        copy[e.target.name] = e.target.value;
        setNewSimcha(copy);
    };

    function formatDate(string) {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([], options);
    }


    return (
        <div className='container' style={{ marginTop: 80 }}>
            {isLoading ? <>
                <Spinner animation="grow" size="sm" variant="info" />
                <Spinner animation="grow" variant="info" />
                <h4>Give me a minute...</h4>
            </> : <>
            <h1>Simchos:</h1>
            <hr />
            <button className='btn btn-primary' onClick={handleShow}>Add Simcha</button>
          
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a Simcha</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type='text' name='name' placeholder='Simcha Name' value={newSimcha.name} className='form-control' onChange={e => onValueChange(e)} />
                    <input type='date' name='date' value={newSimcha.date} className='form-control mt-2' onChange={e => onValueChange(e)} />
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-secondary' onClick={onCancelClick}>
                        Cancel
                    </button>
                    <button className='btn btn-primary' onClick={onSaveClick}>
                        Save 
                    </button>
                </Modal.Footer>
            </Modal>

            <table className='table table-striped table-hover'>
                <thead>
                    <tr>
                        <th>Contributions</th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Contributors</th>
                        <th>Total Collected</th>
                    </tr>
                </thead>
                <tbody>
                    {simchos && simchos.map(s => 
                        <tr key={s.id}>
                            <td>
                                <a className='btn btn-dark' href={`/contributions/${s.id}`}>Contributions</a>
                            </td>
                            <td>{s.name}</td>
                            <td>{formatDate(s.date)}</td>
                            <td>{s.contributors ? `${s.contributors}` : 0}/{totalContributors}</td>
                            <td>${s.totalCollected >= 0 ? s.totalCollected : s.totalCollected * -1}</td>
                        </tr>)}
                </tbody>
                </table>
            </>}
        </div>
    );
};

export default Simchos;