import { Button, Container, TextField, Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyEmailFromState } from '../../initialFormState';
import { IVerifyEmailForm } from '../../models/authentication/verifyEmail';
import { IUserAmplifyResponse } from '../../models/amplifyModels/userAmplify';
import { LOCALSTORAGE_KEYS, getLocalStorage } from '../../storage';

const VerifyEmail: React.FC = () => {
    const navigate = useNavigate();
    const [formState, setFormState] = useState<IVerifyEmailForm>(verifyEmailFromState);
    const username = JSON.parse(getLocalStorage(LOCALSTORAGE_KEYS.USERNAME) as string);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await Auth.confirmSignUp(username, formState.code);
            console.log('User logged in');
            navigate('/setUpTOTP');
        } catch (error) {
            console.log('Error signing in:', error);
        }
    };

    const resendConfirmationCode = async () => {
        try {
            await Auth.resendSignUp(username);
            console.log('code resent successfully');
        } catch (error) {
            console.log('error resending code: ', error);
        }
    };

    return (
        <Container maxWidth="xs">
            <h1>Verify email</h1>
            <form onSubmit={handleSubmit}>
                <Typography>
                    we have sent you a verification code to your email. please enter here verification code.
                </Typography>
                <TextField
                    label="Code"
                    type="text"
                    name="code"
                    value={formState.code}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" type="submit" fullWidth>
                    Submit
                </Button>
                <Button variant="text" fullWidth onClick={resendConfirmationCode}>
                    Resend code
                </Button>
            </form>
        </Container>
    );
};

export default VerifyEmail;
