import { Button, Container, TextField, Grid, Link, IconButton, Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import React, { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { ISignInForm } from '../../models/authentication/signIn';
import { useNavigate } from 'react-router-dom';
import { signInFromState, inputCodeFromState } from '../../initialFormState';
import { toast } from 'react-toastify';
import { IInputCodeForm } from '../../models/authentication/inputCode';
import { UserContext } from '../../context/user-context/userContext';
import { IUserContext } from '../../models/user-context';
import { CognitoHostedUIIdentityProvider } from '../../constant';
import { Google, Apple, Facebook } from '@mui/icons-material';

const SignIn: React.FC = () => {
    const [formState, setFormState] = useState<ISignInForm>(signInFromState);
    const [mfaState, setMFAState] = useState<IInputCodeForm>(inputCodeFromState);
    const [isSoftwareTokenMFA, setIsSoftwareTokenMFA] = useState<boolean>(false);
    const navigate = useNavigate();
    const { setContextUser, contextUser } = useContext(UserContext) as IUserContext;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleMfaInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMFAState((prevState) => ({ ...prevState, [name]: value }));
    };

    const signInWithGoogle = async () => {
        try {
            await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
        } catch (error) {
            console.log('Error signing in with Google:', error);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const user = await Auth.signIn(formState.email, formState.password);
            setContextUser(user);
            if (user.challengeName === 'SOFTWARE_TOKEN_MFA') {
                setIsSoftwareTokenMFA(true);
            } else if (user.challengeName === 'MFA_SETUP') {
                await Auth.setupTOTP(user);
                navigate('/');
            } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                //TODO: add a new screen from user can set new Password. and use below Api.
                // await Auth.completeNewPassword(
                //     user, // the Cognito User Object
                //     newPassword, // the new password
                // );
            } else {
                navigate('/');
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleMFA = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const loggedUser = await Auth.confirmSignIn(contextUser, mfaState.code, 'SOFTWARE_TOKEN_MFA');
            setContextUser(loggedUser);
            navigate('/');
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
                        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                <Link variant="body2" onClick={() => navigate('/forgot-password')}>
                                    Forgot Password?
                                </Link>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" type="submit" fullWidth>
                                    Sign In
                                </Button>
                            </Grid>
                            <Grid item xs={12} display="flex" justifyContent="center">
                                <Typography variant="caption">---OR sign in with---</Typography>
                            </Grid>
                            <Grid item xs={12} display="flex" justifyContent="center">
                                <IconButton size="large" color="inherit" aria-label="menu" onClick={signInWithGoogle}>
                                    <Google />
                                </IconButton>
                                <IconButton size="large" color="inherit" aria-label="menu">
                                    <Apple />
                                </IconButton>
                                <IconButton size="large" color="inherit" aria-label="menu">
                                    <Facebook />
                                </IconButton>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                Don&apos;t have an account?
                                <Link variant="body2" onClick={() => navigate('/sign-up')}>
                                    Sign Up
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            )}
        </>
    );
};

export default SignIn;
