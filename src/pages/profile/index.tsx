import React from 'react';
import { Typography, Button, Grid, Tabs, Box, Tab } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import VerifyEmail from './verifyEmail';
import UpdateEmail from './updateEmail';
import ChangePassword from './changePassword';
import MFAsetting from './MFAsetting';

interface ITabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: ITabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            style={{ width: '800px ' }}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const Profile: React.FC = () => {
    const navigate = useNavigate();

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabValueChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

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
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabValue}
                onChange={handleTabValueChange}
                sx={{ borderRight: 1, borderColor: 'divider', alignContent: 'flex-start' }}
            >
                <Tab
                    label={
                        <Typography fontWeight={700} variant="body1">
                            Email Verified status
                        </Typography>
                    }
                    {...a11yProps(0)}
                />
                <Tab
                    label={
                        <Typography fontWeight={700} variant="body1">
                            Update email address
                        </Typography>
                    }
                    {...a11yProps(1)}
                />
                <Tab
                    label={
                        <Typography fontWeight={700} variant="body1">
                            Change password
                        </Typography>
                    }
                    {...a11yProps(2)}
                />
                <Tab
                    label={
                        <Typography fontWeight={700} variant="body1">
                            MFA settings
                        </Typography>
                    }
                    {...a11yProps(3)}
                />
                <Tab
                    label={
                        <Typography fontWeight={700} variant="body1">
                            Delete User
                        </Typography>
                    }
                    {...a11yProps(4)}
                />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
                <VerifyEmail />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <UpdateEmail />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <ChangePassword />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
                <MFAsetting />
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
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
            </TabPanel>
        </Box>
    );
};

export default Profile;
