import React, { useState } from 'react';

const Login = ({ handleLogin, handleClose, setShowLogin, setShowTable, setShowSignup, getNotes, setNotes }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('https://task-it1-server.vercel.app//taskit-backend/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setShowTable(true);
        setShowSignup(false);

        const notesData = await getNotes(username);

        if (notesData) {
          const updatedNotes = {
            new: notesData.new || [],
            inProgress: notesData.inProgress || [],
            done: notesData.done || [],
          };
          setNotes(updatedNotes);
        }

        handleLogin(event, username);
      } else {
        alert('Username or password is incorrect');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div id="hiddenContent">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLoginFormSubmit}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
          <br />
          <button className="awesome-button" type="submit">Login</button>
          <button className="awesome-button" onClick={handleClose}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
