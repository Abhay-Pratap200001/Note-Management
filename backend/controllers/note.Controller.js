import NoteModel from "../models/note.model.js";

//Get all notes and search
// @route   GET /api/notes
export const getNotes = async (req, res) => {
  try {
    // Get search value from query params
    const { search } = req.query;

    // Default query object
    // Empty {} means fetch all notes
    let query = {};

    // Check if search exists and is not empty
    if (search && search.trim()) {
       //creating case-insensitive regex mens ignore uppercase or lowercase
      const regex = new RegExp(search.trim(), 'i'); 
      query = { $or: [{ title: regex }, { content: regex }] }; // Search in using: title OR content
    }

    //getting all notes and kepping pin notes first and updating latest note first
    const notes = await NoteModel.find(query).sort({ isPinned: -1, updatedAt: -1 });

    res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    console.log('Error in getNotes controller', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Get single note by ID
// @route   GET /api/notes/:id
export const getNoteById = async (req, res) => {
  try {
    const note = await NoteModel.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ success: true, data: note });
  } catch (error) {
    console.log('Error in getNoteById controller', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Create a new note
// @route POST /api/notes
export const createNote = async (req, res) => {
  try {
    const { title, content, tags, category } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const note = await NoteModel.create({
      title: title.trim(),
      content: content || '',
      tags: tags || [],
      category: category || '',
    });

    res.status(201).json({ success: true, data: note });
  } catch (error) {
    console.log('Error in createNote controller', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Update a note by ID
// PUT /api/notes/:id
export const updateNote = async (req, res) => {
  try {
    const { title, content, isPinned, tags, category } = req.body;

     // If title is sent but empty after trimming spaces return validation error
    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }

    // Object to store only fields that need updating
    const updates = {};

    if (title !== undefined) updates.title = title.trim();
    if (content !== undefined) updates.content = content;
    if (isPinned !== undefined) updates.isPinned = isPinned;
    if (tags !== undefined) updates.tags = tags;
    if (category !== undefined) updates.category = category;

    const note = await NoteModel.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true, // apply schema validations
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ success: true, data: note });
  } catch (error) {
    console.log('Error in updateNote controller', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




// Delete a note by ID
// @route   DELETE /api/notes/:id
export const deleteNote = async (req, res) => {
  try {
    const note = await NoteModel.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    console.log('Error in deleteNote controller', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
