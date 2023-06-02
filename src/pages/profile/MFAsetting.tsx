import React, { useContext, useEffect, useState } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import { UserContext } from '../../context/user-context/userContext';
import { IUserContext } from '../../models/user-context';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';
import SetupTOTP from '../authentication/setupToTp';

const MFAsetting: React.FC = () => {
    const { contextUser } = useContext(UserContext) as IUserContext;

    const [showConfigureMFA, setShowConfigureMFA] = useState<boolean>(false);
    const [isMFAEnabled, setIsMFAEnabled] = useState<boolean>(false);

    useEffect(() => {
        getPreferredMFA();
    }, []);

    const getPreferredMFA = async () => {
        await Auth.getPreferredMFA(contextUser, { bypassCache: true })
            .then((MFA) => {
                console.log('MFA', MFA);
                MFA === 'SOFTWARE_TOKEN_MFA' && setIsMFAEnabled(true);
            })
            .catch((e) => {
                toast.error(e.message);
            });
    };

    const disableMFA = async () => {
        await Auth.setPreferredMFA(contextUser, 'NOMFA')
            .then(async () => {
                await getPreferredMFA();
                toast.success('MFA disabled successfully');
            })
            .catch((e) => {
                toast.error(e.message);
            });
    };

    return (
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
    );
};

export default MFAsetting;
