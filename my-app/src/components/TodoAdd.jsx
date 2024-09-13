import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TodoAdd() {
    const [value, setValue] = useState('');
    const apiKey = process.env.REACT_APP_KEY;
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();

    const onChange = (e) => {
        setValue(e.target.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        if (value.trim() === "") return; 
        
            axios.post(baseUrl,
                {
                    item: value
                },
                {
                    headers: {
                        apikey: apiKey,
                        Authorization: `Bearer ${apiKey}`
                    }
                }).then((result) => {
                    setValue('');
                }).catch((err) => {
                    console.error("Add element error:");
                });
    }

    const goToTodo = () => {
        navigate('/');
    }

    return (
        <div className='todo-add-container'>
            <div className='main-container'>
                <form onSubmit={onSubmit}>
                    <input type="text" value={value} onChange={onChange} placeholder='Add Todo' /> <br />
                    <button className='submit' type='submit'>Add</button>
                </form>
                <button className='goToTodo' onClick={goToTodo}>Show Todo</button>
            </div>
        </div>
    )
}

export default TodoAdd;
