import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/profile';
import SignIn from './pages/authentication/signIn';
import SignUp from './pages/authentication/signUp';
import VerifyEmail from './pages/authentication/verifyEmail';
import 'react-toastify/dist/ReactToastify.css';
import SetupTOTP from './pages/authentication/setUpToTp';
import { Hub } from 'aws-amplify';

export default function App() {
    useEffect(() => {
        function listenToAutoSignInEvent() {
            Hub.listen('auth', ({ payload }) => {
                const { event } = payload;
                if (event === 'autoSignIn') {
                    const user = payload.data;
                    console.log(user);
                    // assign user
                } else if (event === 'autoSignIn_failure') {
                    // redirect to sign in page
                    console.log('auto sign in failed');
                }
            });
        }
        listenToAutoSignInEvent();
    }, []);

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/setUpTOTP" element={<SetupTOTP />} />
                </Routes>
            </Router>
            <ToastContainer />
        </>
    );
}
