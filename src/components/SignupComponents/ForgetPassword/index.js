import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../../Common/Header';
import Input from '../../Common/Input';
import Button from '../../Common/Button';

import {auth} from '../../../firebase';
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from 'firebase/auth';

import './style.css'
import { toast } from 'react-toastify';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleForgetPassword = async () => {
        setLoading(true);
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if(methods.length > 0){
            await sendPasswordResetEmail(auth, email)
            .then(() => {
                toast.info(`Check inbox of ${email} to reset password`);
                navigate("/")
            })
            .catch((e) => toast.error(e.message));
        }
        else{
            toast.error("No email registered. Please signup first");
        }

       
        setLoading(false);
    }
    const handleToSignup = () => {
        navigate('/')
    }
  return (

    
    <div>
        <Header/>
        <div className="input-forms">
            
            <h1>Forget Password</h1>
            <Input
                state={email}
                setState={setEmail}
                placeholder="Enter Your Email"
                type='email'
                required={true}
            />

            <Button
                 text={loading ? "Loading.. " : "Reset Password"}
                 onClick={handleForgetPassword}
                 disabled={loading}
            />

            <p className='signup-login' onClick={handleToSignup}>Signup/Login</p>
        </div>
      
    </div>
  )
}

export default ForgetPassword;
