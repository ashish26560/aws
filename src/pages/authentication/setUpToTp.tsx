import { Button, Container, TextField, Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import QRCodeCanvas from 'qrcode.react';
import { ISignInForm } from '../../models/authentication/signIn';
import { useNavigate } from 'react-router-dom';
import { signInFromState, verifyEmailFromState } from '../../initialFormState';
import { toast } from 'react-toastify';
import { IVerifyEmailForm } from '../../models/authentication/verifyEmail';
import { LOCALSTORAGE_KEYS, getLocalStorage } from '../../storage';

const SetupTOTP: React.FC = () => {
    const [formState, setFormState] = useState<IVerifyEmailForm>(verifyEmailFromState);
    const [qrCode, setQRCode] = useState<string>('');
    const username = JSON.parse(getLocalStorage(LOCALSTORAGE_KEYS.USERNAME) as string);
    const navigate = useNavigate();

    useEffect(() => {
        setupTOTP();
    }, []);

    const setupTOTP = async () => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            const code = await Auth.setupTOTP(user);
            // You can directly display the `code` to the user or convert it to a QR code to be scanned.
            // E.g., use following code sample to render a QR code with `qrcode.react` component:
            const str = 'otpauth://totp/AWSCognito:' + username + '?secret=' + code + '&issuer=' + username;
            setQRCode(str);
        } catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const user = await Auth.currentAuthenticatedUser();
            await Auth.verifyTotpToken(user, formState.code);
            await Auth.setPreferredMFA(user, 'TOTP');
            navigate('/dashboard');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container maxWidth="xs">
            <h1>Verify email</h1>
            {qrCode.length ? (
                <form onSubmit={handleSubmit}>
                    <Typography>Scan the below QR code and enter the OTP shown in authenticator app.</Typography>
                    <QRCodeCanvas value={qrCode} />;
                    <TextField
                        label="Code"
                        type="text"
                        name="code"
                        value={formState.code}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" type="submit" fullWidth>
                        Submit
                    </Button>
                </form>
            ) : null}
        </Container>
    );
};

export default SetupTOTP;
