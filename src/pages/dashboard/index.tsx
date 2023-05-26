import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Auth } from 'aws-amplify';
import { IUserAmplifyResponse } from '../../models/amplifyModels/userAmplify';

const Dashboard: React.FC = () => {
    const [user, setUser] = useState<IUserAmplifyResponse>();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user = await Auth.currentUserInfo();
                setUser(user);
            } catch (error) {
                console.log('Error getting user', error);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard
            </Typography>
            <Typography variant="body1" component="p">
                Welcome to the dashboard!
            </Typography>
            {user?.attributes.email}
        </Container>
    );
};

export default Dashboard;
