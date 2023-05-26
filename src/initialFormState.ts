import { ISignInForm } from './models/authentication/signIn';
import { ISignUpForm } from './models/authentication/signUp';
import { IVerifyEmailForm } from './models/authentication/verifyEmail';

export const signInFromState: ISignInForm = {
    email: '',
    password: '',
};

export const signUpFromState: ISignUpForm = {
    email: '',
    username: '',
    password: '',
};

export const verifyEmailFromState: IVerifyEmailForm = {
    username: '',
    code: '',
};
