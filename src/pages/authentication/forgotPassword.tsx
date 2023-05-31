import { Button, Container, TextField, Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordFormState } from '../../initialFormState';
import { IForgotPasswordForm } from '../../models/authentication/forgotPassword';
import { toast } from 'react-toastify';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [formState, setFormState] = useState<IForgotPasswordForm>(forgotPasswordFormState);
    const [verificationCodeSent, setVerificationCodeSent] = useState<boolean>(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({ ...prevState, [name]: value }));
    };

    const requestVerificationCode = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await Auth.forgotPassword(formState.username);
            setVerificationCodeSent(true);
        } catch (error) {
            console.log('Error in forgot password:', error);
        }
    };

    const recoverAccount = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // eslint-disable-next-line no-debugger
            await Auth.forgotPasswordSubmit(formState.username, formState.code, formState.newPassword);

            toast.success('Password set successfully.');
            navigate('/sign-in');
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <Container maxWidth="xs">
            <h1>Forgot password</h1>
            {verificationCodeSent ? (
                <form onSubmit={recoverAccount}>
                    <Typography>Enter your email address.</Typography>
                    <TextField
                        label="Email"
                        type="text"
                        name="username"
                        value={formState.username}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="code"
                        type="text"
                        name="code"
                        value={formState.code}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="New password"
                        type="password"
                        name="newPassword"
                        value={formState.newPassword}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" type="submit" fullWidth>
                        Submit
                    </Button>
                </form>
            ) : (
                <form onSubmit={requestVerificationCode}>
                    <Typography>Enter your email address.</Typography>
                    <TextField
                        label="Email"
                        type="text"
                        name="username"
                        value={formState.username}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" type="submit" fullWidth>
                        Submit
                    </Button>
                </form>
            )}
        </Container>
    );
};

export default ForgotPassword;
