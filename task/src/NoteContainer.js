import React, { useState } from 'react';
import Note from './Note';

const NoteContainer = () => {
  const [notes, setNotes] = useState([]);

  const handleAddNote = () => {
    const newNote = `New Note ${notes.length + 1}`;
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = (text) => {
    const updatedNotes = notes.filter((note) => note !== text);
    setNotes(updatedNotes);
  };

  return (
    <div>
      <button onClick={handleAddNote}>Add Note</button>
      {notes.map((note) => (
        <Note key={note} text={note} onDelete={handleDeleteNote} />
      ))}
    </div>
  );
};

export default NoteContainer;
