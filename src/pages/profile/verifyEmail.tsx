import React, { useContext, useState } from 'react';
import { Grid, Typography, Button, TextField } from '@mui/material';
import { UserContext } from '../../context/user-context/userContext';
import { IUserContext } from '../../models/user-context';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';

const VerifyEmail: React.FC = () => {
    const { contextUser, updateContextUser } = useContext(UserContext) as IUserContext;

    const [showVerifyEmailFrom, setShowVerifyEmailFrom] = useState<boolean>(false);
    const [verifyEmailCode, setVerifyEmailCode] = useState<string>('');

    async function sendVerificationCode() {
        const user = await Auth.currentAuthenticatedUser();
        await Auth.verifyUserAttribute(user, 'email')
            .then(() => {
                setShowVerifyEmailFrom(true);
            })
            .catch((e) => {
                toast.error(e.message);
            });
    }

    async function verifyEmail(e: React.FormEvent) {
        e.preventDefault();
        await Auth.verifyUserAttributeSubmit(contextUser, 'email', verifyEmailCode)
            .then(async () => {
                await updateContextUser();
                setShowVerifyEmailFrom(false);
            })
            .catch((e) => {
                toast.error(e.message);
            });
    }

    return (
        <>
            <Grid
                container
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Grid item xs={6}>
                    <Typography variant="h6">Email verified status</Typography>
                </Grid>
                <Grid item>
                    {(contextUser as any).attributes.email_verified ? (
                        <Button variant="contained" color="success" fullWidth sx={{ mb: '2px' }}>
                            Verified
                        </Button>
                    ) : (
                        <Button variant="contained" color="error" fullWidth sx={{ mb: '2px' }}>
                            Not verified
                        </Button>
                    )}
                </Grid>
            </Grid>
            {!(contextUser as any).attributes.email_verified && !showVerifyEmailFrom && (
                <Grid
                    container
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Grid item xs={6}>
                        <Typography variant="h6">Your email is not verified, Please verify your email</Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mb: '2px' }}
                            onClick={sendVerificationCode}
                        >
                            Verify
                        </Button>
                    </Grid>
                </Grid>
            )}
            {showVerifyEmailFrom && (
                <form onSubmit={verifyEmail}>
                    <TextField
                        label="Verification code"
                        type="text"
                        value={verifyEmailCode}
                        onChange={(e) => setVerifyEmailCode(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: '2px' }}>
                        Verify Email
                    </Button>
                </form>
            )}
        </>
    );
};

export default VerifyEmail;
