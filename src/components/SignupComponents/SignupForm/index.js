import React, { useState } from "react";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import './style.css';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import {setUser} from '../../../slices/userSlice'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db, storage } from "../../../firebase";

const SignupForm = () => {
    
    const [fullName, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleSignup = async() => {
        console.log("Signup Handled");
        setLoading(true);

        if(password == confirmPassword && password.length >= 6 && fullName && email){
            try{

                //creating account
                const userCredentials = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                const user = userCredentials.user;
                // console.log(user.uid);

                //saving account
                await setDoc(doc(db, "users", user.uid), {
                    name: fullName,
                    email: user.email,
                    uid: user.uid,
                    
                });

                dispatch(
                    setUser(
                        {
                        name: fullName,
                        email: user.email,
                        uid: user.uid
                        }
                    )
                );
                toast.success("Account created Successfully");
                setLoading(false);
                navigate("/profile");

            }
            catch(e){
                setLoading(false);
                toast.error(e.message)
            }
        }
        else{
            if(password != confirmPassword){
                toast.error("Password does not match");
            }
            else if (password.length < 6){
                toast.error("Password must atleast have 6 characters");
            }

            else if(!email || !fullName){
                toast.error("Please Enter Credentials")
            }

            setLoading(false);
        }
    }


    return (
        
        <div className="signup-form">
            <Input
                state={fullName}
                setState={setName}
                placeholder="Enter Your Name"
                type='text'
                required={true}
            />

            <Input
                state={email}
                setState={setEmail}
                placeholder="Enter Your Email"
                type='email'
                required={true}
            />

            <Input
                state={password}
                setState={setPassword}
                placeholder="Enter Password"
                type='password'
                required={true}
            />

            <Input
                state={confirmPassword}
                setState={setConfirmPassword}
                placeholder="Re-type your Password"
                type='password'
                required={true}
            />

            

            <Button
                 text={loading ? "Loading..." : "Submit"}
                 onClick={handleSignup}
                 disabled={loading}
            />
                
        </div>
    );
}

export default SignupForm;