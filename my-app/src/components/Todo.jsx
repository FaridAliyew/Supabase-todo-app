import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MdDelete, MdDarkMode } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { GiConfirmed } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import { Ring } from '@uiball/loaders';
import { Modal, Button } from 'react-bootstrap';
import { DarkModeContext } from '../App';

function Todo() {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [updatedValue, setUpdatedValue] = useState("");
    const [sucess, setSucess] = useState([]);

    const { darkMode, setDarkMode } = useContext(DarkModeContext);
    
    const apiKey = process.env.REACT_APP_KEY;
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();

    const myData = () => {
        axios.get(`${baseUrl}?select=*`, {
            headers: {
                apikey: apiKey,
                Authorization: `Bearer ${apiKey}`
            }
        })
            .then((result) => {
                setData(result.data || []);
            }).catch((err) => {
                console.error("Data fetch error:", err);
            });
    }

    useEffect(() => {
        const savedSucess = localStorage.getItem('confirmedItems');
        if (savedSucess) {
            setSucess(JSON.parse(savedSucess));
        }

        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode) {
            setDarkMode(JSON.parse(savedDarkMode));
        }

        myData();
    }, [apiKey]);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        document.body.className = darkMode ? 'dark-mode' : 'light-mode'; 
    }, [darkMode]);

    const deleted = (id) => {
        axios.delete(`${baseUrl}?id=eq.${id}`, {
            headers: {
                apikey: apiKey,
                Authorization: `Bearer ${apiKey}`
            }
        }).then(() => {
            setData(data.filter(el => el.id !== id));
        }).catch((err) => {
            console.error("Delete error:", err);
        });
    }

    const confirmed = (id, currentStatus) => {
        const newStatus = !currentStatus;

        axios.patch(`${baseUrl}?id=eq.${id}`, {
            is_confirmed: newStatus
        }, {
            headers: {
                apikey: apiKey,
                Authorization: `Bearer ${apiKey}`
            }
        })
        .then(() => {
            setSucess(newStatus ? [...sucess, id] : sucess.filter(itemId => itemId !== id));
            myData();
        })
        .catch((err) => {
            console.error("Update error:", err);
        });
    }

    const openModal = (id, currentValue) => {
        setSelectedId(id);
        setUpdatedValue(currentValue);
        setShowModal(true);
    }

    const handleSave = () => {
        if (updatedValue) {
            axios.patch(`${baseUrl}?id=eq.${selectedId}`,
                {
                    item: updatedValue
                },
                {
                    headers: {
                        apikey: apiKey,
                        Authorization: `Bearer ${apiKey}`
                    }
                }
            )
                .then(() => {
                    myData();
                    setShowModal(false);
                })
                .catch((err) => {
                    console.error("Update error:", err);
                });
        }
    }

    const goToTodoAdd = () => {
        navigate('/todoAdd');
    }

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    }

    return (
        <div className='container'>
            <MdDarkMode className='dark-mode-toggle' onClick={toggleDarkMode} />
            <div className='todo-container'>
                <div className='header'>
                    <h1>Todo</h1>
                </div>

                <div className='ol-list'>
                    <ol>
                        {data.length > 0 ? (
                            data.map((el) => (
                                el && el.item ? (
                                    <li key={el.id} className={el.is_confirmed ? "line-through" : ""}>
                                        {el.item}
                                        <div>
                                            <FaPencil className='pen' onClick={() => openModal(el.id, el.item)} />
                                            <MdDelete className='deleted' onClick={() => deleted(el.id)} />
                                            <GiConfirmed className='confirmed' onClick={() => confirmed(el.id, el.is_confirmed)} />
                                        </div>
                                    </li>
                                ) : null
                            ))
                        ) : (
                            <Ring size={40} lineWeight={5} speed={2} color="yellow" />
                        )}
                    </ol>
                </div>
                <button className='goToTodoAdd' onClick={goToTodoAdd}>Todo Add</button>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className='modal-title'>Dəyəri Dəyişdirin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        value={updatedValue}
                        onChange={(e) => setUpdatedValue(e.target.value)}
                        className="form-control"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Todo;
