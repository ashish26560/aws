import { Button, Container, TextField, Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyEmailFromState } from '../../initialFormState';
import { IVerifyEmailForm } from '../../models/authentication/verifyEmail';
import { IUserAmplifyResponse } from '../../models/amplifyModels/userAmplify';

const VerifyEmail: React.FC = () => {
    const navigate = useNavigate();
    const [formState, setFormState] = useState<IVerifyEmailForm>(verifyEmailFromState);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user: IUserAmplifyResponse = await Auth.currentUserInfo();
                setFormState((prevState) => ({ ...prevState, username: user.attributes.email }));
            } catch (error) {
                console.log('Error getting user', error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await Auth.confirmSignUp(formState.username, formState.code);
            console.log('User logged in');
            navigate('/dashboard');
        } catch (error) {
            console.log('Error signing in:', error);
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
            </form>
        </Container>
    );
};

export default VerifyEmail;
