import React, { useEffect, useState } from 'react';
import { Typography, Button, TextField, Accordion, AccordionSummary, AccordionDetails, Grid } from '@mui/material';
import Container from '@mui/material/Container';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import SetupTOTP from '../authentication/setUpToTp';
import { toast } from 'react-toastify';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [showConfigureMFA, setShowConfigureMFA] = useState(false);
    const [isMFAEnabled, setIsMFAEnabled] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationCode, setValidationCode] = useState<string>('');
    const [showValidationCodeUI, setShowValidationCodeUI] = useState(false);

    useEffect(() => {
        getPreferredMFA();
    }, []);

    const getPreferredMFA = async () => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            const MFA = await Auth.getPreferredMFA(user);
            if (MFA === 'SOFTWARE_TOKEN_MFA') {
                setIsMFAEnabled(true);
            }
        } catch (error) {
            console.log('Error changing password:', error);
            // Handle error
        }
    };

    const disableMFA = async () => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            await Auth.setPreferredMFA(user, 'NOMFA');

            toast.success('MFA disabled successfully');

            navigate('/');
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const user = await Auth.currentAuthenticatedUser();
            await Auth.changePassword(user, currentPassword, newPassword);

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            toast.success('Password changed successfully');
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    async function updateUserEmail(e: React.FormEvent) {
        e.preventDefault();

        const user = await Auth.currentAuthenticatedUser();

        await Auth.updateUserAttributes(user, {
            email: newEmail,
        })
            .then(() => {
                toast.success('a verification code is sent');
                setShowValidationCodeUI(true);
            })
            .catch((e) => {
                toast.error(e.message);
            });
    }

    async function verifyEmailValidationCode(code: string) {
        await Auth.verifyCurrentUserAttributeSubmit('email', code)
            .then(() => {
                toast.success('email verified');
            })
            .catch((e) => {
                toast.error(e.message);
            });
    }

    async function deleteUser() {
        await Auth.deleteUser()
            .then(() => {
                toast.success('User deleted successfully');
                navigate('/');
            })
            .catch((e) => {
                toast.error(e.message);
            });
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h5">Profile Page</Typography>
            {/* Update Email form */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography variant="h6">Update email form</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="h6">Enter new email</Typography>
                    {showValidationCodeUI ? (
                        <>
                            <TextField
                                label="Verification Code"
                                type="text"
                                value={validationCode}
                                onChange={(e) => setValidationCode(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mb: '2px' }}
                                onClick={() => verifyEmailValidationCode(validationCode)}
                            >
                                Verify
                            </Button>
                        </>
                    ) : (
                        <form onSubmit={updateUserEmail}>
                            <TextField
                                label="New email"
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: '2px' }}>
                                Update Email
                            </Button>
                        </form>
                    )}
                </AccordionDetails>
            </Accordion>
            {/* Change password form  */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography variant="h6">Change Password form</Typography>
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
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: '2px' }}>
                            Change Password
                        </Button>
                    </form>
                </AccordionDetails>
            </Accordion>
            {/* MFA setting  */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography variant="h6">MFA setting</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid
                        container
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Grid item xs={6}>
                            {isMFAEnabled ? (
                                <Typography variant="h6">MFA is Enabled</Typography>
                            ) : (
                                <Typography variant="h6">MFA is disabled</Typography>
                            )}
                        </Grid>
                        {isMFAEnabled ? (
                            <Grid item>
                                <Button variant="contained" type="submit" onClick={disableMFA}>
                                    Disable MFA
                                </Button>
                            </Grid>
                        ) : null}
                        <Grid item>
                            <Button variant="contained" type="submit" onClick={() => setShowConfigureMFA(true)}>
                                Configure MFA
                            </Button>
                        </Grid>
                        {showConfigureMFA ? <SetupTOTP /> : null}
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography variant="h6">Delete user</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid
                        container
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Grid item xs={6}>
                            <Typography variant="h6">Are you sure you want to delete user?</Typography>
                        </Grid>

                        <Grid item>
                            <Button variant="contained" type="submit" onClick={deleteUser}>
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Container>
    );
};

export default Profile;
