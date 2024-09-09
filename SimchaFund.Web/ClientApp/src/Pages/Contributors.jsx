import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { FaCheck } from "react-icons/fa";
import Spinner from 'react-bootstrap/Spinner';

const Contributors = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [contributors, setContributors] = useState([]);
    const [show, setShow] = useState(false);
    const [newContributor, setNewContributor] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateCreated: '',
    });
    const [alwaysInclude, setAlwaysInclude] = useState(false);
    const [initialDeposit, setInitialDeposit] = useState('');
    const [addMode, setAddMode] = useState(true);
    const [showDeposit, setShowDeposit] = useState(false);
    const [deposit, setDeposit] = useState({
        amount: '',
        date: ''
    });
    const [total, setTotal] = useState('');
    const [searchText, setSearchText] = useState('');

    const loadContributors = async () => {
        setIsLoading(true);
        const { data } = await axios.get('/api/contributors/get');
        setContributors(data.contributors);
        setTotal(data.total);
        setIsLoading(false);
    };

    useEffect(() => {

        loadContributors();

    }, [])

    function formatDate(string) {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([], options);
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const clearSearch = () => setSearchText('');

    const clearOutModal = () => {
        setNewContributor({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            dateCreated: ''
        });
        setAlwaysInclude(false);
        setInitialDeposit('');
        setDeposit({
            amount: '',
            date: ''
        });
    };

    const getSpecificContributor = async id => {
        setAddMode(false);
        const { data } = await axios.get(`/api/Contributors/byid?id=${id}`);
        setNewContributor(data);
        setAlwaysInclude(data.alwaysInclude);
    };

    const onCancelClick = () => {
        setAddMode(true);
        handleClose();
        clearOutModal();
        setShowDeposit(false);
    };

    const onSaveClick = async () => {
        const toPassIn = { ...newContributor, alwaysInclude };
        await axios.post('/api/contributors/add', { Contributor: toPassIn, InitialDeposit: initialDeposit });
        clearOutModal();
        handleClose();
        loadContributors();
    };

    const onValueChange = e => {
        if (e.target.name === 'date' || e.target.name === 'amount') {
            const copy = { ...deposit };
            copy[e.target.name] = e.target.value;
            setDeposit(copy);
        } else {
            const copy = { ...newContributor };
            copy[e.target.name] = e.target.value;
            setNewContributor(copy);
        }
    };

    const onEditClick = id => {
        getSpecificContributor(id);
        handleShow();
    };

    const onAddClick = () => {
        setAddMode(true);
        clearOutModal();
        handleShow();
    };

    const onUpdateClick = async () => {
        const toPassIn = { ...newContributor, alwaysInclude };
        await axios.post('/api/contributors/update', { Contributor: toPassIn });
        clearOutModal();
        handleClose();
        setAddMode(true);
        loadContributors();
    };

    const onDepositClick = id => {
        getSpecificContributor(id);
        setShowDeposit(true);
    };

    async function onDepositSave() {
        let action = { ...deposit };
        action.name = 'Deposit';
        action.contributorId = newContributor.id;
        await axios.post('/api/contributors/addaction', { Action: action });
        onCancelClick();
        loadContributors();
    };

    return (
        <div className='container' style={{ marginTop: 80 }}>
            {isLoading ? <>
                <Spinner animation="grow" size="sm" variant="info" />
                <Spinner animation="grow" variant="info" />
                <h4>Give me a minute...</h4>
            </> : <>

                <h1>Contributors: </h1>
                <hr />
                <div className='row'>
                    <div className='col-md-4'>
                        <button className='btn btn-success' onClick={onAddClick}>Add Contributor</button>
                        </div>
                        <div className='col-md-2'>
                            <input type='text' name='searchtext' placeholder='Search' value={searchText} onChange={e => setSearchText(e.target.value) } className='form-control'/>
                        </div>
                        <div className='col-md-1'>
                            <button className='btn btn-info w-100' onClick={clearSearch}>Clear</button>
                        </div>
                    <div className='col-md-2 offset-3'>
                        <h4>Total: ${total}</h4>
                    </div>
                </div>

                <Modal id='add/edit' show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{addMode ? 'Add a Contributor' : 'Editing...'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body id='inputs'>
                        <div className='row'>
                            <div className='col-md-6'>
                                <input type='text' name='firstName' placeholder='First Name' value={newContributor.firstName} className='form-control mt-2' onChange={e => onValueChange(e)} />
                            </div>
                            <div className='col-md-6'>
                                <input type='text' name='lastName' placeholder='Last Name' value={newContributor.lastName} className='form-control mt-2' onChange={e => onValueChange(e)} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6'>
                                <input type='text' name='phoneNumber' placeholder='Phone Number' value={newContributor.phoneNumber} className='form-control mt-2' onChange={e => onValueChange(e)} />
                            </div>
                            <div className='col-md-6'>
                                <input type='text' hidden={!addMode} name='initialDeposit' placeholder='$ Initial Deposit' value={initialDeposit} className='form-control mt-2' onChange={e => setInitialDeposit(e.target.value)} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6'>
                                    <input type='date' hidden={!addMode} className='form-control mt-2' name='dateCreated' value={newContributor.dateCreated} onChange={e => onValueChange(e)} />
                            </div>
                            <div className='col-md-6'>
                                <div className="form-check mb-3 mt-2">
                                    <input className="form-check-input" type="checkbox" id="alwaysInclude" checked={alwaysInclude} onChange={e => setAlwaysInclude(e.target.checked)} />
                                    <label className="form-check-label" htmlFor="alwaysInclude">Always Include</label>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-secondary' onClick={onCancelClick}>
                            Cancel
                        </button>
                        {addMode ?
                            <button className='btn btn-primary' onClick={onSaveClick}>Add</button>
                            :
                            <button className='btn btn-warning' onClick={onUpdateClick}>Update</button>
                        }
                    </Modal.Footer>
                </Modal>

                <Modal id='deposit' show={showDeposit} onHide={onCancelClick}>
                    <Modal.Header closeButton>
                        <Modal.Title>Deposit for {newContributor.lastName} {newContributor.firstName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input type='text' name='amount' placeholder='Deposit Amount' value={deposit.amount} className='form-control' onChange={e => onValueChange(e)} />
                        <input type='date' name='date' value={Date.newDate} className='form-control mt-2' onChange={e => onValueChange(e)} />
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-secondary' onClick={onCancelClick}>
                            Cancel
                        </button>
                        <button className='btn btn-primary' onClick={onDepositSave}>
                            Save
                        </button>
                    </Modal.Footer>
                </Modal>

                <table id='contributors' className='table table-striped table-hover'>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone Number</th>
                            <th>Current Balance</th>
                            <th>Date Created</th>
                            <th>Always Include</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id='values'>
                            {contributors && contributors.filter(c => (`${c.firstName.toUpperCase()} ${c.lastName.toUpperCase()}`).includes(searchText.toUpperCase())).map(c =>
                                <tr key={c.id}>
                                    <td>{c.firstName}</td>
                                    <td>{c.lastName}</td>
                                    <td>{c.phoneNumber}</td>
                                    <td>${c.balance}</td>
                                    <td>{formatDate(c.dateCreated)}</td>
                                    <td>{c.alwaysInclude ? <FaCheck /> : ''}</td>
                                    <td>
                                        <button className='btn btn-primary' onClick={_ => onEditClick(c.id)}>Edit</button>
                                        <button className='btn btn-success' onClick={_ => onDepositClick(c.id)}>Deposit</button>
                                        <a href={`/history/${c.id}`} className='btn btn-dark' onClick={_ => onHistoryClick(c.id)}>Show History</a>
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </>}
        </div>
    )
};

export default Contributors;