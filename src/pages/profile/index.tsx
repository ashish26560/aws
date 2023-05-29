import React, { useEffect, useState } from 'react';
import { Typography, Button, TextField, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Container from '@mui/material/Container';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [isMFAEnabled, setIsMFAEnabled] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchMFAStatus() {
            try {
                const user = await Auth.currentAuthenticatedUser();
                setIsMFAEnabled(user.preferredMFA === 'SOFTWARE_TOKEN_MFA');
            } catch (error) {
                console.log('Error fetching MFA status:', error);
                // Handle error
            }
        }

        fetchMFAStatus();
    }, []);

    const handleToggleMFA = async () => {
        try {
            setLoading(true);

            const user = await Auth.currentAuthenticatedUser();
            const preferredMFA = isMFAEnabled ? 'NOMFA' : 'SOFTWARE_TOKEN_MFA';

            await Auth.setPreferredMFA(user, preferredMFA);

            setIsMFAEnabled(!isMFAEnabled);
            setLoading(false);
        } catch (error) {
            console.log('Error toggling MFA:', error);
            // Handle error
        }
    };

    async function signOut() {
        try {
            await Auth.signOut();
            navigate('/');
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    const handleChangePassword = async () => {
        setIsChangingPassword(!isChangingPassword);
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const user = await Auth.currentAuthenticatedUser();
            await Auth.changePassword(user, currentPassword, newPassword);

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setIsChangingPassword(false);
            setLoading(false);
        } catch (error) {
            console.log('Error changing password:', error);
            // Handle error
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h5">Profile Page</Typography>

            <Accordion expanded={isChangingPassword} onChange={handleChangePassword}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Change Password</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <form onSubmit={handlePasswordSubmit}>
                        <TextField
                            label="Current Password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Button type="submit" variant="outlined" color="primary" fullWidth sx={{ mb: '2px' }}>
                            Change Password
                        </Button>
                    </form>
                </AccordionDetails>
            </Accordion>

            <Button onClick={signOut} variant="contained" color="primary" fullWidth>
                Sign out
            </Button>
        </Container>
    );
};

export default Profile;
