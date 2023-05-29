export enum LOCALSTORAGE_KEYS {
    USER = 'USER',
    USERNAME = 'USERNAME',
    ACCOUNT = 'ACCOUNT',
}

const defaults = {
    USER: LOCALSTORAGE_KEYS,
    USERNAME: LOCALSTORAGE_KEYS,
    ACCOUNT: LOCALSTORAGE_KEYS,
};

type FeatureKey = keyof typeof defaults;

export const setLocalStorage = (key: FeatureKey, value: string) => {
    localStorage.setItem(key, value);
};

export const getLocalStorage = (key: FeatureKey) => {
    return localStorage.getItem(key);
};

export const removeLocalStorage = (key: FeatureKey) => {
    return localStorage.removeItem(key);
};

export const signOut = () => {
    Object.keys(localStorage).forEach((key: string) => {
        localStorage.removeItem(key);
    });
};
