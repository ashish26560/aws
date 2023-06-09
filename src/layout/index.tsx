import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user-context/userContext';
import { IUserContext } from '../models/user-context';
import { Auth } from 'aws-amplify';
import axios from 'axios';

interface ILayoutProps {
    children?: React.ReactNode;
}

export default function Layout({ children }: ILayoutProps) {
    const navigate = useNavigate();
    const { contextUser } = useContext(UserContext) as IUserContext;

    async function signOut() {
        try {
            await Auth.signOut();
            navigate('/');
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }
    async function apiEndPoint() {
        axios
            .get('https://p5dha7jbhl.execute-api.us-east-1.amazonaws.com/Prod/GetPallet/2', {
                headers: {
                    'content-type': 'application/json',
                    Authorization: (contextUser as any)?.signInUserSession.accessToken.jwtToken,
                },
            })
            .catch((error) => {
                console.error(error);
            });

        // axios
        //     .post('https://p5dha7jbhl.execute-api.us-east-1.amazonaws.com/Prod/GetPallet/PlacePallet', {
        //         Size: { Height: 11, Width: 22, Length: 33 },
        //         Weight: 33,
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //     });
    }

    return (
        <>
            <section className="login-wrapper">
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                                onClick={() => navigate('/')}
                            >
                                <Home />
                            </IconButton>

                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Aws - Amplify app
                            </Typography>

                            {contextUser ? (
                                <>
                                    <Button color="inherit" onClick={() => navigate('/profile')}>
                                        {(contextUser as any)?.signInUserSession.idToken.payload.email}
                                    </Button>
                                    <Button color="inherit" onClick={() => signOut()}>
                                        Sign Out
                                    </Button>

                                    <Button color="inherit" onClick={apiEndPoint}>
                                        Call api
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {/* <Button color="inherit" onClick={() => navigate('/create-user')}>
                                        Create user as admin
                                    </Button> */}
                                    <Button color="inherit" onClick={() => navigate('/sign-up')}>
                                        Sign up
                                    </Button>
                                    <Button color="inherit" onClick={() => navigate('/sign-in')}>
                                        Login
                                    </Button>
                                </>
                            )}
                        </Toolbar>
                    </AppBar>
                </Box>
                {children}
            </section>
        </>
    );
}
