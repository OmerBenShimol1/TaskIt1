import React from 'react';
// Navbar file - Contains Today's date logo
function Navbar({ currentDateTime }) {

    return (
        <div className="top-section">
          <div className="clock">{currentDateTime.toLocaleTimeString()}</div>
    
          <div className="date_date">
            <div className="container">
              <span className="day-label">Day</span>
              <span className="day">{new Date().getDate()}</span>
            </div>
    
            <div className="container">
              <span className="month-label">Month</span>
              <span className="month">
                {new Date().toLocaleString('en-US', { month: 'long' })}
              </span>
            </div>
    
            <div className="container">
              <span className="year-label">Year</span>
              <span className="year">{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      );
    }
    
    export default Navbar;
