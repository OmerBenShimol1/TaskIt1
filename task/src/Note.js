import React from 'react';
import Draggable from 'react-draggable';
import './App.css';


const Note = ({ text, onDelete }) => {
  const handleDelete = () => {
    onDelete(text);
  };

  return (
    <Draggable>
      <div className="note">
        <div className="note-content">{text}</div>
        <button className="delete-button" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </Draggable>
  );
};

export default Note;
