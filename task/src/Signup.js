import React, { useState } from 'react';
import axios from 'axios';

const Signup = ({
    handleSignup,
    confirmPassword,
    setConfirmPassword,
    setShowSignup,
  }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Set an initial value

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };



  const handleRegistrationFormSubmit = async (event) => {
    event.preventDefault();
    if (password === confirmPassword) {
      try {
        const response = await axios.post('https://task-it1-server.vercel.app//taskit-backend/register', {
          username,
          password,
        });

        console.log(response.data.message);

        // Display success message or redirect to login page
        console.log('Registration successful');
        setRegistrationSuccess(true);
        setPasswordsMatch(true);
      } catch (error) {
        if (error.response && error.response.status === 409) {
          // Username already exists
          alert(error.response.data.message);
        } else {
          console.error(error);
          // Display error message
        }
      }
    } else {
      // Passwords don't match
      setPasswordsMatch(false);
    }
  };

  return (
    <div id="hiddenContent2">
      <div className="login-container">
        <h2>Signup</h2>
        <form className="login-form" onSubmit={handleRegistrationFormSubmit}>
          <label>
            Username:
            <input type="text" value={username} onChange={handleUsernameChange} />
          </label>
          <label>
            Password:
            <input type="password" value={password} onChange={handlePasswordChange} />
          </label>
          <label>
            Confirm password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          {!passwordsMatch && <p>Passwords do not match</p>}
          {registrationSuccess ? (
            <p>Registration successful</p>
          ) : (
            <button className="awesome-button">Register</button>
          )}
          <button className="awesome-button" onClick={() => setShowSignup(false)}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
