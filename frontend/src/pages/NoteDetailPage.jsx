import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ConfirmDialog from '../components/ConfirmDialog'
import { getNote, deleteNote, updateNote } from '../services/api'


function formatDate(dateString) {
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('en-US', dateOptions)
}


function NoteDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [noteData, setNoteData] = useState(null)
  const [isLoadingNote, setIsLoadingNote] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    fetchNoteDetails()
  }, [id])

  async function fetchNoteDetails() {
    try {
      const response = await getNote(id) // from services/api.js → GET /api/notes/:id
      setNoteData(response.data.data)    // store the note object in state
    } catch (error) {
      toast.error('Note not found')
      navigate('/') 
    }
    setIsLoadingNote(false)
  }

   async function handleDeleteNote() {
    try {
      await deleteNote(id) // from services/api.js → DELETE /api/notes/:id
      toast.success('Note deleted')
      navigate('/') // redirect to home after deletion
    } catch (error) {
      toast.error('Failed to delete note')
    }
  }

  async function handleTogglePin() {
    try {
      const newPinnedStatus = !noteData.isPinned // flip the current pin status
      const response = await updateNote(id, { isPinned: newPinnedStatus })
      setNoteData(response.data.data) // update local state with the latest note data from backend
      toast.success(newPinnedStatus ? 'Note pinned' : 'Note unpinned')
    } catch (error) {
      toast.error('Failed to update note')
    }
  }

  // Show spinner while waiting for GET /api/notes/:id response
  if (isLoadingNote) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-9 h-9 rounded-full border-4 border-purple-800/40 border-t-purple-400 animate-spin" />
        <p className="text-sm text-purple-300/60">Loading note...</p>
      </div>
    )
  }

  // Safety check — if fetch succeeded but data is somehow null, render nothing
  if (!noteData) return null

  return (
    <div >
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <button
          onClick={() => navigate('/')}
          className="text-sm font-medium text-purple-300/60 hover:text-white transition-colors duration-200">
          ← Back to Notes
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePin}
            className="px-3 py-2 text-sm font-medium text-purple-200/80 bg-white/[0.07] hover:bg-white/[0.13] border border-white/15 rounded-xl transition-all duration-200">
            {noteData.isPinned ? '📌 Unpin' : '📍 Pin'}
          </button>

          <button
            onClick={() => navigate(`/notes/${id}/edit`)}
            className="px-3 py-2 text-sm font-medium text-purple-200/80 bg-white/[0.07] hover:bg-white/[0.13] border border-white/15 rounded-xl transition-all duration-200">
            ✏️ Edit
          </button>

        
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="px-3 py-2 text-sm font-medium text-white bg-red-500/70 hover:bg-red-500/90 border border-red-400/30 rounded-xl transition-all duration-200">
            🗑️ Delete
          </button>
        </div>
      </div>


      {/* Note content card*/}
      <div className="bg-white/[0.02] backdrop-blur-xl border border-purple-700/45 rounded-2xl p-7 shadow-xl shadow-black/40">
      <div className='flex'>
        {noteData.isPinned && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-300 bg-purple-500/20 border border-purple-400/30 px-2.5 py-1 rounded-full mb-4">
            📌 Pinned
          </span>
        )}

      {/* Note Category */}
        {noteData.category && (
          <span className="inline-block text-xs font-medium px-3 py-1 bg-purple-600/25 text-purple-300 border border-purple-500/30 rounded-full mb-4 ml-2">
            {noteData.category}
          </span>
        )}
        </div>

        <h1 className="text-2xl font-bold text-purple-100/90 mb-3 leading-snug">{noteData.title}</h1>

        <div className="flex flex-wrap gap-4 text-xs text-purple-200/80 mb-4">
          <span>📅 Created: {formatDate(noteData.createdAt)}</span>
          <span>✏️ Updated: {formatDate(noteData.updatedAt)}</span>
        </div>


       {/* Note Data */}
        {noteData.tags && noteData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {noteData.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-400/25 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ===== CONTENT ===== */}
        <div className="border-t border-white/[0.09] pt-5">
          {noteData.content ? (
            <p className="text-sm text-purple-200/90 leading-relaxed whitespace-pre-wrap">
              {noteData.content}
            </p>
          ) : (
            <p className="text-sm text-purple-300/40 italic">No content added</p>
          )}
        </div>

      </div>

      {/* ===== DELETE CONFIRM DIALOG ===== */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Note"
        message={`Are you sure you want to delete "${noteData.title}"? This cannot be undone.`}
        onConfirm={handleDeleteNote}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  )
}

export default NoteDetailPage
