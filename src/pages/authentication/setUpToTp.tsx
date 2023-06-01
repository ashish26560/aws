import { Button, Container, TextField, Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import QRCodeCanvas from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { inputCodeFromState } from '../../initialFormState';
import { IInputCodeForm } from '../../models/authentication/inputCode';
import { UserContext } from '../../context/user-context/userContext';
import { IUserContext } from '../../models/user-context';
import { toast } from 'react-toastify';

const SetupTOTP: React.FC = () => {
    const [formState, setFormState] = useState<IInputCodeForm>(inputCodeFromState);
    const [qrCode, setQRCode] = useState<string>('');
    const navigate = useNavigate();
    const { contextUser } = useContext(UserContext) as IUserContext;

    useEffect(() => {
        contextUser && setupTOTP();
    }, [contextUser]);

    const setupTOTP = async () => {
        const username = (contextUser as any)?.attributes?.email;
        try {
            // const user = await Auth.currentAuthenticatedUser();
            const code = await Auth.setupTOTP(contextUser);
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
            toast.success('MFA is Configured');
            navigate('/');
        } catch (error: any) {
            toast.error(error.message);
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
