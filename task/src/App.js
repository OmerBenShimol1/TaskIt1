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
/* Main App file */

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
    const [showAllTasks] = useState(false); 
    const [username, setUsername] = useState('');
// Get user's notes
  const getNotes = async (username) => {
    try {
      const response = await axios.get('https://task-it1-server.vercel.app/taskit-backend/notes', {
        params: { username },
      });
      const notesData = response.data;
      console.log('Notes data:', notesData); // Log the notes data

      const updatedNotes = {
        new: [],
        inProgress: [],
        done: [],
      };

      // Checking each note and put it to the right category in table.
      notesData.forEach((note) => {
        const { _id, taskName, priority, date, column } = note;

        const newNote = {
          id: _id,
          task: taskName,
          priority,
          date,
          status: column,
        };

        // Check if the column name matches the status and put the note into the right category
        if (updatedNotes[column]) { 
          updatedNotes[column].push(newNote);
        }
      });

      setNotes(updatedNotes); // Update the notes
    } catch (error) {
      console.error('Error retrieving notes:', error.response.data.message);
    }
  };
    // Handle Today's tasks. (Showing the today's date notes)
  const TodayTasksHandler = () => {
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
     
  // Handle Tasks by selected day. (Showing the specific date notes)
  const SelectedDateTasksHandler = (selectedDate) => {
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
    //Show the calender pop up
  const CalendarButtonClickHandler = () => {
    setSelectedDate(null); // Reset the selected date
    setShowCalendarPopup(!showCalendarPopup);
  };
      
    //Show the Logo pop up
    const LogoPopUpHandler = () => {
      setShowLogo(false);
      setShowCalendarPopup(false);
    };

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }, []);
// Handle login by given input
    const LoginHandler = (event, loggedInUsername) => {
      event.preventDefault();
      setShowLogin(true);
      setUsername(loggedInUsername); // Update the username state with the logged-in username
    };
    // Handle Signup by given input
    const SignupHandler = (event) => {
      event.preventDefault();
      setShowSignup(true);
    };
// Handle close button (Send the user to the home page from Login or Signup)
    const CloseHandler = () => {
      setShowLogin(false);
    };

    const ShowPopupHandler = () => {
      setShowPopup(!showPopup);
    };
    
// Handle Note submit by given note data
  const NoteSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      await axios.post('https://task-it1-server.vercel.app/taskit-backend/saveTaskData', {
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


              
      const LogoutHandler = () => {
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
  LogoutHandler={LogoutHandler}
  CalendarButtonClickHandler={CalendarButtonClickHandler}
  TodayTasksHandler={TodayTasksHandler}
  SelectedDateTasksHandler={SelectedDateTasksHandler}
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
      <button className="calendar-popup-button" onClick={() => SelectedDateTasksHandler(selectedDate)}>Ok</button>
    </div>
  </div>
)}

<Notes
          notes={notes}
          selectedColumns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
          LogoPopUp={LogoPopUpHandler}
          setNotes={setNotes}
          username={username}
          getNotes={getNotes}
          showLogo={showLogo} 
          setShowLogo={setShowLogo}
        />
              <div className="center-bottom2">
                <button
                  id="bt"
                  onClick={ShowPopupHandler}
                  className="newtask-button"
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <div>
  {showLogin && (
    <Login
      LoginHandler={(event, loggedInUsername) => LoginHandler(event, loggedInUsername)}
      CloseHandler={CloseHandler}
      setShowLogin={setShowLogin}
      setShowTable={setShowTable}
      setShowSignup={setShowSignup}
      getNotes={getNotes}
      setNotes={setNotes}
    />
  )}
                  {showSignup && ( <Signup
            SignupHandler={SignupHandler}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            setShowSignup={setShowSignup}
          />)}
  <div className="center-container">
    {!showLogin && !showSignup && (
      <div className="center-bottom">
        <button id="bt" onClick={LoginHandler} className="awesome-button">
          Login
        </button>
        <button id="bt2" onClick={SignupHandler} className="awesome-button">
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
        To move the task to in progress or done you can click on column selection.
        By click on the calender you can pick a date and see the tasks for this day. 
        If there is any task in a date it will show in green.
      </h3>
      <button onClick={() => setShowinst(false)}>Close</button>
    </div>
  </div>

  )}


          {showPopup && (
            <div className="popup">
              <div className="popup-content">
                <h2>New Task</h2>
                <form onSubmit={NoteSubmitHandler}>
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
                  <button className="close-button" onClick={ShowPopupHandler}>
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
