import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const navigate = useNavigate();

    return (
        <>
            
        </>
    )
}

export default Signup;