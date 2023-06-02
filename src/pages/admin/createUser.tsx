import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Button, Container, TextField } from '@mui/material';
import { ISignUpForm } from '../../models/authentication/signUp';
import { signUpFromState } from '../../initialFormState';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createUser } from '../../services/cognitoService';

const CreateUser: React.FC = () => {
    const [formState, setFormState] = useState<ISignUpForm>(signUpFromState);
    const navigate = useNavigate();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await createUser(formState.email, formState.password, [{ Name: 'email', Value: formState.email }]);
            toast.success('User created');
            navigate('/');
        } catch (error) {
            toast.error(`Error creating user in: ${error}`);
        }
    };

    return (
        <Container maxWidth="xs">
            <h1>Create a user</h1>
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
                    label="Temporary password"
                    type="password"
                    name="password"
                    value={formState.password}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" type="submit" fullWidth>
                    Create
                </Button>
            </form>
        </Container>
    );
};

export default CreateUser;
