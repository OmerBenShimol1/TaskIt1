import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faSignOutAlt,
  faCalendarDay,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons';

/*Toolbar file*/

const Toolbar = ({ LogoutHandler, CalendarButtonClickHandler, TodayTasksHandler, getNotes, username, setShowinst }) => {
  const TodayTasksClickHandler = () => {
    TodayTasksHandler(); // Call the function when the button is clicked
  };

  return (
    <div className="toolbar">
       <h8>Task It</h8>
      <button className="toolbar-button" onClick={LogoutHandler}>
        <FontAwesomeIcon icon={faSignOutAlt} />
        Logout
      </button>
      <button className="toolbar-button" onClick={CalendarButtonClickHandler}>
        <FontAwesomeIcon icon={faCalendarAlt} />
        Calendar
      </button>
      <button className="toolbar-button" onClick={TodayTasksClickHandler}>
        <FontAwesomeIcon icon={faCalendarDay} />
        Today Tasks
      </button>
      <button className="toolbar-button" onClick={() => getNotes(username)}>
        <FontAwesomeIcon icon={faCalendarAlt} />
        All Tasks
      </button>
      <button className="toolbar-button" onClick={setShowinst}>
        <FontAwesomeIcon icon={faLightbulb} />
        How it works?
      </button>
    </div>
  );
};

export default Toolbar;
