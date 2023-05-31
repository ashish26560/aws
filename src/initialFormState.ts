import { ISignInForm } from './models/authentication/signIn';
import { ISignUpForm } from './models/authentication/signUp';
import { IInputCodeForm } from './models/authentication/inputCode';
import { IForgotPasswordForm } from './models/authentication/forgotPassword';

export const signInFromState: ISignInForm = {
    email: '',
    password: '',
};

export const signUpFromState: ISignUpForm = {
    email: '',
    username: '',
    password: '',
};

export const inputCodeFromState: IInputCodeForm = {
    code: '',
};

export const forgotPasswordFormState: IForgotPasswordForm = {
    username: '',
    code: '',
    newPassword: '',
};
