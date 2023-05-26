import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import SignIn from './pages/authentication/signIn';
import SignUp from './pages/authentication/signUp';
import VerifyEmail from './pages/authentication/verifyEmail';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}
