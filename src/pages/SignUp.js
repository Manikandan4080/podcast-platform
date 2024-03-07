import React, { useState } from "react";
import Header from "../components/Common/Header";
import SignupForm from "../components/SignupComponents/SignupForm";
import LoginForm from "../components/SignupComponents/LoginForm";
import { useNavigate } from "react-router-dom";

const SignUp = () => {

    const [signup, setSignup] = useState(true);
    const navigate = useNavigate();

    const handleForgetPassword = () => {
        navigate('/forget-password')
    }
    return (
        <div>
            <Header/>
            <div className="input-forms">
                {signup ? <h1>Signup</h1> : <h1>Login</h1>}
                {signup ? <SignupForm/> : <LoginForm/>}

                {signup ? 
                    <p style={{margin:"20px"}}>Already Have an account !
                     <span 
                      className="span-link"
                      onClick={() => setSignup(!signup)}
                      >
                       Click Here
                     </span>
                    </p>
                    
                    :
                    <p style={{margin:"20px"}}>Don't Have an account !
                     <span 
                      className="span-link"
                      onClick={() => setSignup(!signup)}
                      >
                       Click Here
                     </span>
                    </p> 
                }

                {
                    !signup && <p className="span-link" onClick={handleForgetPassword}>Forget Password</p>
                }
            </div>
        </div>
    );
}

export default SignUp;