export interface IUserContext {
    contextUser: object | null;
    setContextUser: (user: object | null) => void;
    updateContextUser: () => Promise<void>;
}
