import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Auth } from 'aws-amplify';
import { Button, Container, TextField } from '@mui/material';
import { ISignUpForm } from '../../models/authentication/signUp';
import { signUpFromState } from '../../initialFormState';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LOCALSTORAGE_KEYS, setLocalStorage } from '../../storage';

const SignUp: React.FC = () => {
    const [formState, setFormState] = useState<ISignUpForm>(signUpFromState);
    const navigate = useNavigate();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const { user } = await Auth.signUp({
                username: formState.email,
                password: formState.password,
                autoSignIn: { enabled: true },
            });
            setLocalStorage(LOCALSTORAGE_KEYS.USERNAME, JSON.stringify(formState.email));
            toast.success('User created');
            navigate('/verify-email');
        } catch (error) {
            toast.error(`Error creating user in: ${error}`);
        }
    };

    return (
        <Container maxWidth="xs">
            <h1>Sign Up</h1>
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
                    Sign Up
                </Button>
                <Button variant="text" type="submit" fullWidth onClick={() => navigate('/sign-in')}>
                    Sign in
                </Button>
            </form>
        </Container>
    );
};

export default SignUp;
