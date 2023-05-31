const awsConfig = {
    aws_project_region: process.env.REACT_APP_AWS_PROJECT_REGION,
    aws_cognito_identity_pool_id: process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
    aws_cognito_region: process.env.REACT_APP_AWS_COGNITO_REGION,
    aws_user_pools_id: process.env.REACT_APP_AWS_USER_POOLS_ID,
    aws_user_pools_web_client_id: process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID,
    oauth: {
        domain: process.env.REACT_APP_AWS_OAUTH_DOMAIN,
        scope: [
            process.env.REACT_APP_AWS_OAUTH_SCOPE_1,
            process.env.REACT_APP_AWS_OAUTH_SCOPE_2,
            process.env.REACT_APP_AWS_OAUTH_SCOPE_3,
        ],
        redirectSignIn: process.env.REACT_APP_AWS_OAUTH_REDIRECT_SIGN_IN,
        redirectSignOut: process.env.REACT_APP_AWS_OAUTH_REDIRECT_SIGN_OUT,
        responseType: process.env.REACT_APP_AWS_OAUTH_RESPONSE_TYPE,
        // Update the following properties with your federated provider details
        social_google_client_id: process.env.REACT_APP_AWS_OAUTH_SOCIAL_GOOGLE_CLIENT_ID,
        social_google_client_secret: process.env.REACT_APP_AWS_OAUTH_SOCIAL_GOOGLE_CLIENT_SECRET,
        // social_amazon_client_id: 'YOUR_AMAZON_CLIENT_ID',
        // social_amazon_client_secret: 'YOUR_AMAZON_CLIENT_SECRET',
    },
};

export default awsConfig;
