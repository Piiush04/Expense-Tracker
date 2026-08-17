import React,{useState} from 'react';
import {login} from "../services/authService";
import "../App.css"

function LoginPage({onLoginSuccess}){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");

    const handleLogin = async (e)=> {
        e.preventDefault();

        try {
            const data = await login(email,password);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            onLoginSuccess(data.token);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p style={{color: "red"}}>{error}</p>}

            <form onSubmit={handleLogin}>
                <input type="email" placeholder='email' value={email} onChange={(e)=> setEmail(e.target.value)} required />
                <input type="password" placeholder='password' value={password} onChange={(e)=> setPassword(e.target.value)} required />

                <button type='submit'>Login</button>
            </form>
            <p>
                Don't have account? <a href="#signup">Signup</a>
            </p>
        </div>
    );
}

export default LoginPage;