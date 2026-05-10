import express from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/note.Controller.js';

const router = express.Router();

router.route('/').get(getNotes).post(createNote);

router.route('/:id').get(getNoteById).put(updateNote).delete(deleteNote);

export default router;
