const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5001; // Change this to the desired port number

app.use(
  cors({
    origin: 'https://task-it1.vercel.app',
  })
);

// Connect to MongoDB Atlas
mongoose
  .connect('mongodb+srv://amitandomerdb:AO123@cluster0.emguiob.mongodb.net/taskit-backend?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.log('Error connecting to MongoDB Atlas:', error));

// Define a User model
const User = mongoose.model('User', {
  username: String,
  password: String,
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }] // Add this line
});

// Define a Note schema
const noteSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  column: {
    type: String,
    required: true
  }

});

// Define a Note model using the schema
const Note = mongoose.model('Note', noteSchema);

// Define a route for handling user registration
app.post('/taskit-backend/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Create a new user
    const newUser = new User({ username, password });
    await newUser.save();

    return res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/taskit-backend/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user with the provided username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Define a route for saving task data
app.post('/taskit-backend/saveTaskData', async (req, res) => {
  const { taskName, priority, date, username,column } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new note document
    const note = new Note({ taskName, priority, date, username , column });
    await note.save();

    return res.json({ message: 'Task data saved successfully' });
  } catch (error) {
    console.error('Error saving task data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Define a route for inserting user-specific notes
app.post('/taskit-backend/insertUserNotes', async (req, res) => {
  const { username } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch notes that belong to the user
    const userNotes = await Note.find({ username });

    // Update the user document to include the notes
    user.notes = userNotes.map(note => note._id);
    await user.save();

    return res.json({ message: 'User notes inserted successfully' });
  } catch (error) {
    console.error('Error inserting user notes:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// Define a route for retrieving notes for a user
app.get('/taskit-backend/notes', async (req, res) => {
  const { username } = req.query;

  try {
    // Find the user with the provided username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve all notes associated with the user
    const notes = await Note.find({ username });

    return res.status(200).json(notes);
  } catch (error) {
    console.error('Error retrieving notes:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// Define a route for updating task data
app.put('/taskit-backend/updateTaskData', async (req, res) => {
  const { taskId, newTaskName, newStatus } = req.body;

  try {
    // Find the note with the provided taskId
    const note = await Note.findById(taskId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Update the note's task name and status
    note.taskName = newTaskName;
    note.column = newStatus;
    await note.save();

    return res.json({ message: 'Task data updated successfully' });
  } catch (error) {
    console.error('Error updating task data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/taskit-backend/deleteNote/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the note with the provided id
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Delete the note from the database
    await note.deleteOne();

    return res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return res.status(500).json({ message: 'Failed to delete note' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
