import { OktaAuth } from '@okta/okta-auth-js';
import oktaConfig from './oktaConfig';

const oktaAuth = new OktaAuth(oktaConfig);

const login = async (username, password) => {
  try {
    const transaction = await oktaAuth.signInWithCredentials({ username, password });
    if (transaction.status === 'SUCCESS') {
      oktaAuth.token.getWithRedirect({
        sessionToken: transaction.sessionToken,
        // Add additional parameters as needed
      });
      return transaction.status;
    }
  } catch (err) {
    throw err;
  }
};

const logout = async () => {
  await oktaAuth.signOut();
};

const isAuthenticated = async () => {
  // Checks if there is a current accessToken in the TokenManager.
  const token = await oktaAuth.tokenManager.get('accessToken');
  return !!token;
};

const handleAuthentication = async () => {
  const tokens = await oktaAuth.token.parseFromUrl();
  tokens.forEach(token => {
    if (token.idToken) {
      oktaAuth.tokenManager.add('idToken', token);
    }
    if (token.accessToken) {
      oktaAuth.tokenManager.add('accessToken', token);
    }
  });
};

const getAccessToken = () => {
  return oktaAuth.tokenManager.get('accessToken')
    .then(accessToken => {
      return accessToken ? accessToken.accessToken : '';
    });
};

const getIdToken = () => {
  return oktaAuth.tokenManager.get('idToken')
    .then(idToken => {
      return idToken ? idToken.idToken : '';
    });
};

const getUser = async () => {
  return oktaAuth.token.getUserInfo();
};

// Export individual functions for use in components
export const AuthService = {
  login,
  logout,
  isAuthenticated,
  handleAuthentication,
  getAccessToken,
  getIdToken,
  getUser,
};

export default AuthService;
