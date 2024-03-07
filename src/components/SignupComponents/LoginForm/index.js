import React, { useState } from "react";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import './style.css';

import { signInWithEmailAndPassword } from "firebase/auth";
import {auth, db} from '../../../firebase';
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const InputForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleLogin = async() => {
        console.log("Login started")
        setLoading(true);
        try{

            const userCredentials = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredentials.user;

            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.data();

            dispatch(
                setUser(
                    {
                    name: userData.name,
                    email: user.email,
                    uid: user.uid
                    }
                )
            );
            toast.success("Login Successfull");
            setLoading(false);
            navigate("/profile");
        }
        catch(e){
            console.log(e);
            setLoading(false);
            toast.error(e.message);
        }

    }

    return (
        <div className="login-form">

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

            <Button
                 text={loading ? "Loading.. " : "Login"}
                 onClick={handleLogin}
                 disabled={loading}
            />

        </div>
    );
}

export default InputForm