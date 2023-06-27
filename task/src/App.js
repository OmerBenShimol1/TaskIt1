  import React, { useState, useEffect } from 'react';
  import './App.css';
  import logo from './logo.jpg';
  import DatePicker from 'react-datepicker';
  import 'react-datepicker/dist/react-datepicker.css';
  import axios from 'axios';
  import Login from './Login';
  import Signup from './Signup';
  import Navbar from './Navbar';
  import Toolbar from './Toolbar';
  import Notes from './Notes';


  function App() {
    const [notes, setNotes] = useState({
      new: [],
      inProgress: [],
      done: [],
    });
    const [selectedColumns, setSelectedColumns] = useState({});
    const [showTable, setShowTable] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [task, setTask] = useState('');
    const [priority, setPriority] = useState('Low');
    const [date, setDate] = useState('');
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [showLogo, setShowLogo] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showCalendarPopup, setShowCalendarPopup] = useState(false);
    const [showTodayTasks] = useState(false);
    const [ ,setShowNotes] = useState(true); 
    const [showInst, setShowinst] = useState(false);
    const [showAllTasks] = useState(false); // Add new state variable
    const [username, setUsername] = useState('');

  const getNotes = async (username) => {
    try {
      const response = await axios.get('https://task-it1-server.vercel.app//taskit-backend/notes', {
        params: { username },
      });
      const notesData = response.data;
      console.log('Notes data:', notesData); // Log the notes data

      const updatedNotes = {
        new: [],
        inProgress: [],
        done: [],
      };

      // Loop through each note in notesData and insert it into the appropriate status category
      notesData.forEach((note) => {
        const { _id, taskName, priority, date, column } = note;

        const newNote = {
          id: _id,
          task: taskName,
          priority,
          date,
          status: column,
        };

        // Check if the column name matches the status and push the note into the respective category
        if (updatedNotes[column]) {
          updatedNotes[column].push(newNote);
        }
      });

      setNotes(updatedNotes); // Set the state with the retrieved notes
    } catch (error) {
      console.error('Error retrieving notes:', error.response.data.message);
    }
  };
    
  const handleTodayTasks = () => {
    setShowNotes((prevShowNotes) => !prevShowNotes);
  
    if (!showTodayTasks && !showAllTasks) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
  
      const filteredNotes = {
        new: notes.new.filter((note) => note.date === formattedDate),
        inProgress: notes.inProgress.filter((note) => note.date === formattedDate),
        done: notes.done.filter((note) => note.date === formattedDate),
      };
  
      setNotes(filteredNotes);
    } else if (!showAllTasks) {
      setNotes({
        new: [],
        inProgress: [],
        done: [],
      });
    }
  };
     
  
  const handleSelectedDateTasks = (selectedDate) => {
    if (selectedDate) {
      const timezoneOffset = selectedDate.getTimezoneOffset() * 60000;
      const formattedDate = new Date(
        new Date(selectedDate.getTime() - timezoneOffset).setUTCHours(0, 0, 0, 0)
      ).toISOString().split('T')[0];
  
      const filteredNotes = {
        new: notes.new.filter((note) => {
          const noteDate = new Date(
            new Date(note.date).getTime() - timezoneOffset
          ).toISOString().split('T')[0];
          return noteDate === formattedDate;
        }),
        inProgress: notes.inProgress.filter((note) => {
          const noteDate = new Date(
            new Date(note.date).getTime() - timezoneOffset
          ).toISOString().split('T')[0];
          return noteDate === formattedDate;
        }),
        done: notes.done.filter((note) => {
          const noteDate = new Date(
            new Date(note.date).getTime() - timezoneOffset
          ).toISOString().split('T')[0];
          return noteDate === formattedDate;
        }),
      };
  
      setNotes(filteredNotes);
      setSelectedDate(selectedDate);
    }
  };
    
  const handleCalendarButtonClick = () => {
    setSelectedDate(null); // Reset the selected date
    setShowCalendarPopup(!showCalendarPopup);
  };
      


    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }, []);

    const handleLogin = (event, loggedInUsername) => {
      event.preventDefault();
      setShowLogin(true);
      setUsername(loggedInUsername); // Update the username state with the logged-in username
    };
    
    const handleSignup = (event) => {
      event.preventDefault();
      setShowSignup(true);
    };

    const handleClose = () => {
      setShowLogin(false);
    };

    const handleShowPopup = () => {
      setShowPopup(!showPopup);
    };
    

  const handleNoteSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('https://task-it1-server.vercel.app//taskit-backend/saveTaskData', {
        taskName: task,
        priority,
        date,
        username,
        column: 'new'
      });

      // Fetch the updated notes from the server
      await getNotes(username);

      console.log('Task data saved successfully');
      // Perform any other actions or display a success message to the user
    } catch (error) {
      console.error('Error saving task data:', error);
      // Display an error message to the user
    }

    setShowPopup(false);
    setTask("");
    setPriority("Low");
    setDate("");
  };


              
      const handleLogout = () => {
      setShowTable(false);
      setShowLogin(false);
      setShowSignup(false);
      setShowLogo(true); // Set showLogo state to true
      };

      return (
        <div className="App">
    <div className="top-section">
        {showLogo && <img src={logo} alt="Logo" />}
        </div>
        <Navbar currentDateTime={currentDateTime} />
          {showTable ? (
          
          <div id="tableContainer">
<Toolbar
  handleLogout={handleLogout}
  handleCalendarButtonClick={handleCalendarButtonClick}
  handleTodayTasks={handleTodayTasks}
  handleSelectedDateTasks={handleSelectedDateTasks} // Pass the new function as a prop
  getNotes={getNotes}
  username={username}
  setShowinst={setShowinst}
/>

{showCalendarPopup && (
  <div className="calendar-popup">
    <div className="calendar-popup-header">
      <h3>Select a date</h3>
    </div>
    <div className="calendar-popup-content">
      <DatePicker
        className="calendar-popup-datepicker"
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        inline
        highlightDates={[
          ...notes.new.map((note) => new Date(note.date)),
          ...notes.inProgress.map((note) => new Date(note.date)),
          ...notes.done.map((note) => new Date(note.date))
        ]}

      />
    </div>
    <div className="calendar-popup-controls">
      <button className="calendar-popup-button" onClick={() => setShowCalendarPopup(false)}>Close</button>
      <button className="calendar-popup-button" onClick={() => handleSelectedDateTasks(selectedDate)}>Ok</button>
    </div>
  </div>
)}

<Notes
          notes={notes}
          selectedColumns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
          setNotes={setNotes}
          username={username}
          getNotes={getNotes}
        />
              <div className="center-bottom2">
                <button
                  id="bt"
                  onClick={handleShowPopup}
                  className="awesome-button"
                >
                  New Task
                </button>
              </div>
            </div>
          ) : (
            <div>
  {showLogin && (
    <Login
      handleLogin={(event, loggedInUsername) => handleLogin(event, loggedInUsername)}
      handleClose={handleClose}
      setShowLogin={setShowLogin}
      setShowTable={setShowTable}
      setShowSignup={setShowSignup}
      getNotes={getNotes}
      setNotes={setNotes}
    />
  )}
                  {showSignup && ( <Signup
            handleSignup={handleSignup}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            setShowSignup={setShowSignup}
          />)}
  <div className="center-container">
    {!showLogin && !showSignup && (
      <div className="center-bottom">
        <button id="bt" onClick={handleLogin} className="awesome-button">
          Login
        </button>
        <button id="bt2" onClick={handleSignup} className="awesome-button">
          Signup
        </button>
        
      </div>
    )}
  </div>
            </div>
          )}

  {showInst && (
    <div className="popup">
    <div className="popup-content">
      <h2>How it is work:</h2>
      <h3>First, you need to add a new task.
        To do that, click on the "New Task" button.
        After that we will have to enter the name of the task, the urgency and the date to perform the task.
        After clicking Add you will see the task in the "New" column. 
        To move the task to problem or done you can click on column selection and choose not to move the task.


      </h3>
      <button onClick={() => setShowinst(false)}>Close</button>
    </div>
  </div>

  )}


          {showPopup && (
            <div className="popup">
              <div className="popup-content">
                <h2>New Task</h2>
                <form onSubmit={handleNoteSubmit}>
                  <input
                    type="text"
                    placeholder="Task"
                    value={task}
                    onChange={(event) => setTask(event.target.value)}
                    required
                  />
                  <select
                    value={priority}
                    onChange={(event) => setPriority(event.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <input
                    type="date"
                    placeholder="Date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    required
                  />
                  <button type="submit">Add</button>
                  <button className="close-button" onClick={handleShowPopup}>
                  Close
                </button>

                </form>
              </div>
            </div>
          )}
        </div>
      );
    }

    export default App;
