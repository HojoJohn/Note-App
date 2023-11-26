import React, { useState } from 'react';

import { useOktaAuth } from '@okta/okta-react';

const Login = () => {
  const { oktaAuth } = useOktaAuth();
 
  const [sessionToken, setSessionToken] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const transaction = await oktaAuth.signInWithCredentials({
        username: event.target.username.value,
        password: event.target.password.value,
      });
      if (transaction.status === 'SUCCESS') {
        setSessionToken(transaction.sessionToken);
        oktaAuth.token.getWithRedirect({
          sessionToken: transaction.sessionToken,
        });
      } else {
        setError('Login failed: Unexpected status ' + transaction.status);
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
    }
  };

  if (sessionToken) {
    // Session token is available but the user needs to be redirected
    // to complete the authentication process
    oktaAuth.token.getWithRedirect({
      sessionToken,
    });
    return null;
  }

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
