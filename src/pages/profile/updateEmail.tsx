import React, { useContext, useState } from 'react';
import { Typography, Button, TextField } from '@mui/material';
import { UserContext } from '../../context/user-context/userContext';
import { IUserContext } from '../../models/user-context';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';

const UpdateEmail: React.FC = () => {
    const { contextUser, updateContextUser } = useContext(UserContext) as IUserContext;

    const [newEmail, setNewEmail] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [showVerifyEmailFrom, setShowVerifyEmailFrom] = useState(false);

    async function updateUserEmail(e: React.FormEvent) {
        e.preventDefault();
        await Auth.updateUserAttributes(contextUser, {
            email: newEmail,
        })
            .then(() => {
                toast.success('A verification code is sent');
                setNewEmail('');
                setShowVerifyEmailFrom(true);
            })
            .catch((e) => {
                toast.error(e.message);
            });
    }

    async function verifyEmail(e: React.FormEvent) {
        e.preventDefault();
        await Auth.verifyCurrentUserAttributeSubmit('email', verificationCode)
            .then(async () => {
                await updateContextUser();
                setShowVerifyEmailFrom(false);
                toast.success('Your email has been verified');
            })
            .catch((e) => {
                toast.error(e.message);
            });
    }

    return (
        <>
            {showVerifyEmailFrom ? (
                <>
                    <form onSubmit={verifyEmail}>
                        <Typography variant="h6">Add Verification code</Typography>
                        <TextField
                            label="Verification Code"
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: '2px' }}>
                            Verify
                        </Button>
                    </form>
                </>
            ) : (
                <>
                    <form onSubmit={updateUserEmail}>
                        <Typography variant="h6">Add new email</Typography>
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
                </>
            )}
        </>
    );
};

export default UpdateEmail;
