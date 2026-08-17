import React,{useState} from 'react';
import {signup} from "../services/authService";

function SignupPage({onSignupSuccess}){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");

    const handleSignup = async (e)=> {
        e.preventDefault();

        try {
            const data = await signup(email,password);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            onSignupSuccess(data.token);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Signup</h2>
            {error && <p style={{color: "red"}}>{error}</p>}

            <form onSubmit={handleSignup}>
                <input type="email" placeholder='email' value={email} onChange={(e)=> setEmail(e.target.value)} required />
                <input type="password" placeholder='password' value={password} onChange={(e)=> setPassword(e.target.value)} required />

                <button type='submit'>Signup</button>
            </form>
            <p>
                Already have account? <a href="#login">Login</a>
            </p>
        </div>
    );
}



export default SignupPage;