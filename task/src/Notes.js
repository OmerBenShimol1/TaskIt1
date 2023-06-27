
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // Add axios import if it's not already imported

const Notes = ({
    notes,
    selectedColumns,
    setSelectedColumns,
    setNotes,
    username,
    getNotes
  }) => {
    const handleEditNote = async (column, index, newTask, selectedColumn) => {
        try {
          const response = await axios.put('https://task-it1-server.vercel.app/taskit-backend/updateTaskData', {
            taskId: notes[column][index].id,
            newTaskName: newTask,
            newStatus: selectedColumn,
          });
      
          const result = response.data;
      
          if (response.status === 200) {
            console.log(result.message); // Task data updated successfully
            // Perform any other actions or display a success message to the user
          } else {
            console.error(result.message); // Internal server error or note not found
            // Display an error message to the user
          }
        } catch (error) {
          console.error('Error updating task data:', error);
          // Display an error message to the user
        }
      
        setNotes((prevNotes) => {
          const updatedNotes = { ...prevNotes };
      
          // Retrieve the note from the original column
          const note = updatedNotes[column][index];
      
          if (note) {
            // Update the task name and status of the note
            note.task = newTask;
            note.status = selectedColumn;
      
            if (column !== selectedColumn) {
              // Remove the note from the original column
              updatedNotes[column] = updatedNotes[column].filter((_, i) => i !== index);
      
              // Check if the note already exists in the selected column
              const noteExists = updatedNotes[selectedColumn].some((n) => n.id === note.id);
      
              // Add the note to the selected column only if it doesn't already exist
              if (!noteExists) {
                updatedNotes[selectedColumn].splice(index, 0, note);
              }
            }
          }
      
          return updatedNotes;
        });
      };
  
      const handleDeleteNote = async (column, index, id) => {
        try {
          // Make the DELETE request to the server after a delay
          await new Promise((resolve) => setTimeout(resolve, 500)); // Add a delay of 500 milliseconds
          const response = await axios.delete(`https://task-it1-server.vercel.app/taskit-backend/deleteNote/${id}`);
      
          if (response.status !== 200) {
            throw new Error(response.data.message);
          }
      
          // Update the state with the deleted note removed
          setNotes((prevNotes) => {
            const updatedNotes = { ...prevNotes };
            updatedNotes[column] = prevNotes[column].filter((_, i) => i !== index);
            return updatedNotes;
          });
      
          // Retrieve the updated notes from the server
          await getNotes(username);
        } catch (error) {
          console.error('Error deleting note:', error);
          // Handle the error, show a notification, etc.
        }
      };
      
  return (
    <div id="tableContainer">
      <table>
        <thead>
          <tr>
            <th>New</th>
            <th>In progress</th>
            <th>Done</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {notes.new.map((note, index) => (
                <div className="note" key={note.id} draggable>
                  <div className="note-content">
                    {note.task}
                    <br />
                    Priority: {note.priority}
                    <br />
                    Date: {note.date}
                  </div>

                  <select
                    value={selectedColumns[note.id] || ''}
                    onChange={(event) => {
                      const selectedColumn = event.target.value;
                      setSelectedColumns((prevSelectedColumns) => ({
                        ...prevSelectedColumns,
                        [note.id]: selectedColumn,
                      }));
                    }}
                  >
                    <option value="">Select column</option>
                    <option value="new">New</option>
                    <option value="inProgress">In Progress</option>
                    <option value="done">Done</option>
                  </select>

                  <button
                    className="edit-button"
                    onClick={() =>
                        handleEditNote('new', index, note.task, selectedColumns[note.id])
                    }
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>

                  <div className="note-actions">
                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDeleteNote('new', index, note.id)
                      }
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </div>
                </div>
              ))}
            </td>
            <td>
              {notes.inProgress.map((note, index) => (
                <div className="note" key={note.id}>
                  <div className="note-content">
                    {note.task}
                    <br />
                    Priority: {note.priority}
                    <br />
                    Date: {note.date}
                  </div>
                  <div className="note-actions">
                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDeleteNote('inProgress', index, note.id)
                      }
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                    <select
                      value={selectedColumns[note.id] || ''}
                      onChange={(event) => {
                        const selectedColumn = event.target.value;
                        setSelectedColumns((prevSelectedColumns) => ({
                          ...prevSelectedColumns,
                          [note.id]: selectedColumn,
                        }));
                      }}
                    >
                      <option value="">Select column</option>
                      <option value="new">New</option>
                      <option value="inProgress">In Progress</option>
                      <option value="done">Done</option>
                    </select>

                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEditNote('inProgress', index, note.task, selectedColumns[note.id])
                      }
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                  </div>
                </div>
              ))}
            </td>
            <td>
              {notes.done.map((note, index) => (
                <div className="note" key={note.id}>
                  <div className="note-content">
                    {note.task}
                    <br />
                    Priority: {note.priority}
                    <br />
                    Date: {note.date}
                  </div>
                  <div className="note-actions">
                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDeleteNote('done', index, note.id)
                      }
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                    <select
                      value={selectedColumns[note.id] || ''}
                      onChange={(event) => {
                        const selectedColumn = event.target.value;
                        setSelectedColumns((prevSelectedColumns) => ({
                          ...prevSelectedColumns,
                          [note.id]: selectedColumn,
                        }));
                      }}
                    >
                      <option value="">Select column</option>
                      <option value="new">New</option>
                      <option value="inProgress">In Progress</option>
                      <option value="done">Done</option>
                    </select>

                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEditNote('done', index, note.task, selectedColumns[note.id])
                      }
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                  </div>
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Notes;
