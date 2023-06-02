import React, { useContext, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Profile from './pages/profile';
import SignIn from './pages/authentication/signIn';
import SignUp from './pages/authentication/signUp';
import VerifyEmail from './pages/authentication/verifyEmail';
import 'react-toastify/dist/ReactToastify.css';
import SetupTOTP from './pages/authentication/setUpToTp';
import { Hub } from 'aws-amplify';
import { UserContext } from './context/user-context/userContext';
import { IUserContext } from './models/user-context';
import HomePage from './pages/home/homePage';
import Layout from './layout';
import ForgotPassword from './pages/authentication/forgotPassword';
import CreateUser from './pages/admin/createUser';

export default function App() {
    const { setContextUser } = useContext(UserContext) as IUserContext;

    useEffect(() => {
        function listenToAutoSignInEvent() {
            Hub.listen('auth', ({ payload }) => {
                const { event } = payload;
                if (event === 'autoSignIn') {
                    const user = payload.data;
                    console.log(user);
                    setContextUser(user);
                } else if (event === 'autoSignIn_failure') {
                    console.log('auto sign in failed');
                } else if (event === 'signOut') {
                    setContextUser(null);
                }
            });
        }
        listenToAutoSignInEvent();
    }, []);

    return (
        <>
            <Router>
                <Routes>
                    <Route
                        element={
                            <>
                                <Layout>
                                    <Outlet />
                                </Layout>
                            </>
                        }
                    >
                        <Route path="/" element={<HomePage />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/setUpTOTP" element={<SetupTOTP />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/create-user" element={<CreateUser />} />
                </Routes>
            </Router>
            <ToastContainer />
        </>
    );
}
