import React, { createContext, useEffect, useState } from 'react';
import { IUserContext } from '../../models/user-context';
import { Auth } from 'aws-amplify';

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

    const getCurrentUser = async () => {
        try {
            const user = await Auth.currentAuthenticatedUser({ bypassCache: true });
            user && setContextUser(user);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <UserContext.Provider value={{ contextUser, setContextUser: handleSetUser }}>{children}</UserContext.Provider>
    );
};
export default UserProvider;
