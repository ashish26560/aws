import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Auth } from 'aws-amplify';
import { Button, Container, TextField } from '@mui/material';
import { ISignUpForm } from '../../models/authentication/signUp';
import { signUpFromState } from '../../initialFormState';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
            await Auth.signUp({
                username: formState.email,
                password: formState.password,
            });
            toast.success('User created');
            navigate('/verify-email');
        } catch (error) {
            toast.error('Error creating user in:');
        }
    };

    return (
        <Container maxWidth="xs">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                {/* <TextField
                    label="User name"
                    type="text"
                    name="username"
                    value={formState.username}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                /> */}
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
                <Button variant="text" type="submit" fullWidth onClick={() => navigate('/')}>
                    Sign in
                </Button>
            </form>
        </Container>
    );
};

export default SignUp;
