/*
  NoteCard.jsx — A single note displayed as a card in the grid on HomePage
*/

import { useNavigate } from 'react-router-dom'

function formatDate(dateString) {
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', dateOptions)
}


function NoteCard({ note, onDelete, onPin }) {
  const navigate = useNavigate()

  /**
    shortPreview — shows only the first 120 characters of the note content
    If content is longer than 120 chars, "..." is appended
    If note has no content, shows a default placeholder message
    note.content comes from the backend note object passed via props
  */
  const shortPreview = note.content ? note.content.substring(0, 120) + (note.content.length > 120 ? '...' : '')  : 'No content added yet'


  function handlePinButtonClick(e) {
    e.stopPropagation()
    onPin(note._id, !note.isPinned) 
  }


  /**
   * handleEditButtonClick — called when user clicks the ✏️ button
   * e.stopPropagation() prevents the card body click from also firing
   */
  function handleEditButtonClick(e) {
    e.stopPropagation()
    navigate(`/notes/${note._id}/edit`)
  }

  function handleDeleteButtonClick(e) {
    e.stopPropagation()
    onDelete(note._id, note.title)
  }

  return (
    <div
      className={`flex flex-col rounded-2xl overflow-hidden backdrop-blur-xl border
        transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-900/50
        ${note.isPinned ? 'bg-white/[0.09] border-purple-400/50 shadow-lg shadow-purple-800/30' : 'bg-white/[0.07] border-white/[0.12] shadow-md shadow-black/20'}`}>

      {note.isPinned && (
        <div className="h-[3px] w-full bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-200" />
      )}

      {/* "Pinned" badge — only shown when note.isPinned is true */}
      {note.isPinned && (
        <div className="px-4 pt-z">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-300 bg-purple-600/20 border border-purple-400/30 px-2.5 py-0.5 rounded-full">
            📌 Pinned
          </span>
        </div>
      )}


      <div className="p-4 flex-1 cursor-pointer"
        onClick={() => navigate(`/notes/${note._id}`)} >


        {note.category && (
          <span className="inline-block text-[11px] font-medium px-2.5 py-0.5 bg-purple-600/25 text-purple-300 border border-purple-500/30 rounded-full mb-2">
            {note.category}
          </span>
        )}

        <h3 className="font-semibold text-purple-100/90 text-[15px] mb-2 leading-snug">
          {note.title}
        </h3>

        <p className="text-[13px] text-purple-200/90 leading-relaxed mb-3">
          {shortPreview}
        </p>

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-400/25 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="text-[11px] text-purple-200/80 space-y-0.5">
          <div>📅 Created: {formatDate(note.createdAt)}</div>
          <div>✏️ Updated: {formatDate(note.updatedAt)}</div>
        </div>
      </div>


      <div className="flex items-center justify-end gap-1 px-3 py-2 border-t border-white/[0.08] bg-black/10">

        {/* Pin/Unpin — calls handlePinButtonClick → calls onPin from HomePage */}
        <button
          title={note.isPinned ? 'Unpin' : 'Pin'}
          onClick={handlePinButtonClick}
          className="p-1.5 rounded-lg text-base hover:bg-purple-500/25 transition-all duration-200">
          {note.isPinned ? '📌' : '📍'}
        </button>

        <button
          title="Edit"
          onClick={handleEditButtonClick}
          className="p-1.5 rounded-lg text-base hover:bg-indigo-500/25 transition-all duration-200">
          ✏️
        </button>

        <button
          title="Delete"
          onClick={handleDeleteButtonClick}
          className="p-1.5 rounded-lg text-base hover:bg-red-500/25 transition-all duration-200">
          🗑️
        </button>
      </div>
    </div>
  )
}

export default NoteCard
