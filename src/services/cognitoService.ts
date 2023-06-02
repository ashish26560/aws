import { CognitoIdentityServiceProvider } from 'aws-sdk';

// Initialize AWS SDK and set up the necessary configurations
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
    region: process.env.REACT_APP_AWS_COGNITO_REGION,
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY_ID as string,
    },
});

// Function to create a user using the AdminCreateUser API
export async function createUser(
    username: string,
    temporaryPassword: string,
    // userAttributes: { Name: string; Value: string }[],
): Promise<CognitoIdentityServiceProvider.AdminCreateUserResponse> {
    try {
        // Call the AdminCreateUser API
        const response = await cognitoIdentityServiceProvider
            .adminCreateUser({
                UserPoolId: process.env.REACT_APP_AWS_USER_POOLS_ID as string,
                Username: username,
                TemporaryPassword: temporaryPassword,
                // UserAttributes: userAttributes,
            })
            .promise();

        // Return the response containing the details of the created user
        return response;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}
