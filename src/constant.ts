export type MFAtype = 'TOTP' | 'SMS' | 'NOMFA' | 'SMS_MFA' | 'SOFTWARE_TOKEN_MFA';

export enum CognitoHostedUIIdentityProvider {
    Cognito = 'COGNITO',
    Google = 'Google',
    Facebook = 'Facebook',
    Amazon = 'LoginWithAmazon',
    Apple = 'SignInWithApple',
}
