import React, { useContext, useState } from 'react';
import { Typography, Button, TextField } from '@mui/material';
import { UserContext } from '../../context/user-context/userContext';
import { IUserContext } from '../../models/user-context';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';

const ChangePassword: React.FC = () => {
    const { contextUser } = useContext(UserContext) as IUserContext;

    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        await Auth.changePassword(contextUser, currentPassword, newPassword)
            .then(() => {
                setCurrentPassword('');
                setNewPassword('');
                toast.success('Password changed successfully');
            })
            .catch((e) => {
                toast.error(e.message);
            });
    };

    return (
        <form onSubmit={handleChangePassword}>
            <Typography variant="h6">Change Password</Typography>
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
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: '2px' }}>
                Change Password
            </Button>
        </form>
    );
};

export default ChangePassword;
