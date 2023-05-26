import { Button, Container, TextField } from '@mui/material';
import { Auth } from 'aws-amplify';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { ISignInForm } from '../../models/authentication/signIn';
import { useNavigate } from 'react-router-dom';
import { signInFromState } from '../../initialFormState';
import { toast } from 'react-toastify';

const SignIn: React.FC = () => {
    const [formState, setFormState] = useState<ISignInForm>(signInFromState);
    const navigate = useNavigate();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await Auth.signIn(formState.email, formState.password);
            console.log('User logged in');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
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
    );
};

export default SignIn;
