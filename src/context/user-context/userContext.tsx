import React, { createContext, useEffect, useState } from 'react';
import { IUserContext } from '../../models/user-context';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';

export const UserContext = createContext<IUserContext | null>(null);
type Props = {
    children: React.ReactNode;
};
const UserProvider = ({ children }: Props) => {
    const [contextUser, setContextUser] = useState<object | null>(null);
    const handleSetUser = (user: object | null) => {
        setContextUser(user);
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    async function getCurrentUser() {
        await Auth.currentAuthenticatedUser({ bypassCache: true })
            .then((user) => {
                user && setContextUser(user);
            })
            .catch((e) => {
                toast.error(e.message);
            });
    }

    return (
        <UserContext.Provider value={{ contextUser, setContextUser: handleSetUser, updateContextUser: getCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
};
export default UserProvider;
