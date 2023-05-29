import { Button, Container, TextField } from '@mui/material';
import { Auth } from 'aws-amplify';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { ISignInForm } from '../../models/authentication/signIn';
import { useNavigate } from 'react-router-dom';
import { signInFromState, verifyEmailFromState } from '../../initialFormState';
import { toast } from 'react-toastify';
import { IVerifyEmailForm } from '../../models/authentication/verifyEmail';

const SignIn: React.FC = () => {
    const [formState, setFormState] = useState<ISignInForm>(signInFromState);
    const [user, setUser] = useState();
    const [mfaState, setMFAState] = useState<IVerifyEmailForm>(verifyEmailFromState);
    const [isSoftwareTokenMFA, setIsSoftwareTokenMFA] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleMfaInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMFAState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const user = await Auth.signIn(formState.email, formState.password);
            setUser(user);
            if (user.challengeName === 'SOFTWARE_TOKEN_MFA') {
                setIsSoftwareTokenMFA(true);
            } else if (user.challengeName === 'MFA_SETUP') {
                // This happens when the MFA method is TOTP
                // The user needs to setup the TOTP before using it
                // More info please check the Enabling MFA part
                await Auth.setupTOTP(user);
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.log(err.message);
            toast.error(err.message);
        }
    };

    const handleMFA = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const loggedUser = await Auth.confirmSignIn(
                user, // Return object from Auth.signIn()
                mfaState.code, // Confirmation code
                'SOFTWARE_TOKEN_MFA', // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
            );
            navigate('/dashboard');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <>
            {isSoftwareTokenMFA ? (
                <Container maxWidth="xs">
                    <h1>Add MFA code</h1>
                    <form onSubmit={handleMFA}>
                        <TextField
                            label="Code"
                            type="text"
                            name="code"
                            value={mfaState.code}
                            onChange={handleMfaInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <Button variant="contained" type="submit" fullWidth>
                            Submit
                        </Button>
                    </form>
                </Container>
            ) : (
                <Container maxWidth="xs">
                    <h1>Sign In</h1>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            type="email"
                            name="email"
                            value={formState.email}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Password"
                            type="password"
                            name="password"
                            value={formState.password}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <Button variant="contained" type="submit" fullWidth>
                            Sign In
                        </Button>
                        <Button variant="text" onClick={() => navigate('/sign-up')}>
                            Create Account ?
                        </Button>
                    </form>
                </Container>
            )}
        </>
    );
};

export default SignIn;
