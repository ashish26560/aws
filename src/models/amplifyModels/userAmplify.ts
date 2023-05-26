export interface IUserAmplifyResponse {
    id: string;
    username: string;
    attributes: {
        sub: string;
        email_verified: boolean;
        email: string;
    };
}
