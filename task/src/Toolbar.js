import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faSignOutAlt,
  faCalendarDay,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons';

/*Toolbar Page*/

const Toolbar = ({ logout, CalendarButtonClick, TodayTasks, getNotes, username, setShowinst }) => {
  const TodayTasksClick = () => {
    TodayTasks(); // Call the function when the button is clicked
  };

  return (
    <div className="toolbar">
      <button className="toolbar-button" onClick={logout}>
        <FontAwesomeIcon icon={faSignOutAlt} />
        Logout
      </button>
      <button className="toolbar-button" onClick={CalendarButtonClick}>
        <FontAwesomeIcon icon={faCalendarAlt} />
        Calendar
      </button>
      <button className="toolbar-button" onClick={TodayTasksClick}>
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
      <h8>Task It</h8>
    </div>
  );
};

export default Toolbar;
