import React, { useState } from 'react';
/* Login Page */
const Login = ({LoginHandler, CloseHandler, setShowLogin, setShowTable, setShowSignup, getNotes, setNotes }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const UsernameChangeHandler = (event) => {
    setUsername(event.target.value);
  };

  const PasswordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const LoginFormSubmitHandler = async (event) => {
    event.preventDefault();
// Check if the given username and password exists and match
    try {
      const response = await fetch('https://task-it1-server.vercel.app/taskit-backend/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setShowTable(true);
        setShowSignup(false);
// Getting user notes from the database.
        const notesData = await getNotes(username);

        if (notesData) {
          const updatedNotes = {
            new: notesData.new || [],
            inProgress: notesData.inProgress || [],
            done: notesData.done || [],
          };
          setNotes(updatedNotes);
        }

        LoginHandler(event, username);
      } else {
        alert('Username or password is incorrect');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
// Login form
  return (
    <div id="hiddenContent">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={LoginFormSubmitHandler}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={UsernameChangeHandler}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={PasswordChangeHandler}
            />
          </label>
          <br />
          <button className="awesome-button" type="submit">Login</button>
          <button className="awesome-button" onClick={CloseHandler}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
