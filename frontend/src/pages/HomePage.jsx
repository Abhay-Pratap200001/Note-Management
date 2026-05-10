/*
 HomePage.jsx — The main landing page of the app ("/")
  What this page does:
    Fetches all notes from the backend API (GET /api/notes)
    Shows them in a responsive grid using the NoteCard component
    Has a live search bar — re-fetches notes every time the search text changes
    Handles pin/unpin of a note without re-fetching everything from server
    Opens a ConfirmDialog before deleting a note
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import NoteCard from '../components/NoteCard'
import ConfirmDialog from '../components/ConfirmDialog'
import { getNotes, deleteNote, updateNote } from '../services/api'

function HomePage() {
  const navigate = useNavigate()


  const [allNotes, setAllNotes] = useState([])

  const [isLoadingNotes, setIsLoadingNotes] = useState(true)

  // searchKeyword — whatever the user types in the search box
  // this is sent to the backend as a query param: GET /api/notes?search=keyword
  const [searchKeyword, setSearchKeyword] = useState('')

  // showDeleteDialog — controls whether the ConfirmDialog popup is visible or not
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // noteToDeleteId / noteToDeleteTitle — stored temporarily when user clicks delete
  // used to call the delete API and show the note title inside the dialog message
  const [noteToDeleteId, setNoteToDeleteId] = useState(null)
  const [noteToDeleteTitle, setNoteToDeleteTitle] = useState('')


  /*
   * Runs fetchAllNotes() every time searchKeyword changes
   * So when the user types in the search box, notes are re-fetched automatically
   */
  useEffect(() => {
    fetchAllNotes()
  }, [searchKeyword])


  async function fetchAllNotes() {
    setIsLoadingNotes(true)
    try {
      const response = await getNotes(searchKeyword)
      setAllNotes(response.data.data) // response.data is axios wrapper, .data is our API response
    } catch (error) {
      toast.error('Failed to load notes')
    }
    setIsLoadingNotes(false)
  }


  /*
    openDeleteConfirmation — called when user clicks 🗑️ on a NoteCard
    Receives noteId and noteTitle from NoteCard via the onDelete prop
    Stores them in state so we know which note to delete when user confirms
    Then shows the ConfirmDialog popup
  */
  function openDeleteConfirmation(noteId, noteTitle) {
    setNoteToDeleteId(noteId)
    setNoteToDeleteTitle(noteTitle)
    setShowDeleteDialog(true)
  }


  /**
   * closeDeleteConfirmation — called when user clicks Cancel in the ConfirmDialog
   * Resets delete-related state and hides the dialog
   */
  function closeDeleteConfirmation() {
    setShowDeleteDialog(false)
    setNoteToDeleteId(null)
    setNoteToDeleteTitle('')
  }


  async function handleDeleteNote() {
    try {
      await deleteNote(noteToDeleteId)
      toast.success('Note deleted')
      // Filter out the deleted note from the current list without calling API again
      setAllNotes(allNotes.filter((note) => note._id !== noteToDeleteId))
    } catch (error) {
      toast.error('Failed to delete note')
    }
    closeDeleteConfirmation()
  }


  /**
   * handlePinNote — called when user clicks 📍/📌 on a NoteCard
   * Receives noteId and shouldBePinned from NoteCard via the onPin prop
   * Sends PUT request to update only the isPinned field
   * Backend: PUT /api/notes/:id  →  noteController.js → updateNote()
   * On success: updates that note in allNotes state and re-sorts so pinned notes stay on top
   */
  async function handlePinNote(noteId, shouldBePinned) {
    try {
      const response = await updateNote(noteId, { isPinned: shouldBePinned })
      const updatedNote = response.data.data // the updated note object returned from backend

      // Replace the old note object with the updated one in the list
      const updatedNotesList = allNotes.map((note) => note._id === noteId ? updatedNote : note)

      // Sort: pinned notes first, then by most recently updated
      updatedNotesList.sort((a, b) => b.isPinned - a.isPinned || new Date(b.updatedAt) - new Date(a.updatedAt))
      setAllNotes(updatedNotesList)
      toast.success(shouldBePinned ? 'Note pinned' : 'Note unpinned')
    } catch (error) {
      toast.error('Failed to update note')
    }
  }


  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">My Notes</h1>
        <p className="text-sm text-purple-300/60 mt-0.5">
          {allNotes.length} {allNotes.length === 1 ? 'note' : 'notes'} saved
        </p>
      </div>


      {/* ===== SEARCH BAR ===== */}
      {/**
       * When user types, setSearchKeyword updates the state
       * The useEffect above detects the change and re-calls fetchAllNotes()
       * which sends the new keyword to GET /api/notes?search=keyword
       */}
      <div className="relative mb-6">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400/70 text-sm pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search notes by title or content..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white bg-white/[0.01] border border-purple-600/30 placeholder:text-purple-300/40 focus:outline-none focus:border-purple-400/70 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"/>
        {/* Clear button — only shown when there is text in the search box */}
        {searchKeyword && (
          <button
            onClick={() => setSearchKeyword('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-purple-400/60 hover:text-white transition-colors">
            ✕
          </button>
        )}
      </div>

     
      {isLoadingNotes && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-9 h-9 rounded-full border-4 border-purple-800/40 border-t-purple-400 animate-spin" />
          <p className="text-sm text-purple-300/60">Loading notes...</p>
        </div>
      )}


      {!isLoadingNotes && allNotes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-2">
          <span className="text-6xl mb-2">{searchKeyword ? '🔍' : '📝'}</span>
          <h3 className="text-lg font-semibold text-white">
            {searchKeyword ? 'No notes found' : 'No notes yet'}
          </h3>

          <p className="text-sm text-purple-300/55 max-w-xs">
            {searchKeyword
              ? `Nothing matched "${searchKeyword}". Try a different keyword.`
              : 'Create your first note to get started!'}
          </p>

          {/* Only show this button when there is no active search */}
          {!searchKeyword && (
            <button
              onClick={() => navigate('/notes/new')}
              className="mt-3 px-6 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-900/40 hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200">
              Create Note
            </button>
          )}
        </div>
      )}


      {!isLoadingNotes && allNotes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allNotes.map((note) => (
            <NoteCard
              key={note._id}        
              note={note}           
              onDelete={openDeleteConfirmation} 
              onPin={handlePinNote}           
            />
          ))}
        </div>
      )}


      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Note"
        message={`Are you sure you want to delete "${noteToDeleteTitle}"? This cannot be undone.`}
        onConfirm={handleDeleteNote}
        onCancel={closeDeleteConfirmation}
      />

    </div>
  )
}

export default HomePage
