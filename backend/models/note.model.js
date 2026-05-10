import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    content: {
      type: String,
      trim: true,
      default: '',
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    tags: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      trim: true,
      default: '',
    },

  },
  { timestamps: true }
);

// Create TEXT INDEX on title and content
// Helps MongoDB perform fast text searching
// Example:
// Note.find({ $text: { $search: "react" } })
noteSchema.index({ title: 'text', content: 'text' });

export default mongoose.model('Note', noteSchema);
