
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getNote, updateNote } from '../services/api'

const inputClass = `w-full px-4 py-2.5 rounded-xl text-sm text-white
  bg-white/[0.07] border border-purple-600/30
  placeholder:text-purple-300/40
  focus:outline-none focus:border-purple-400/70 focus:ring-2 focus:ring-purple-500/20
  transition-all duration-200`

const labelClass = 'block text-sm font-semibold text-purple-200/90 mb-1.5'

const categoryList = ['Personal', 'Work', 'Study', 'Ideas', 'To-Do', 'Health', 'Finance', 'Other']

function EditNotePage() {
  /*
   useParams — reads the :id from the current URL
  */
  const { id } = useParams()

  const navigate = useNavigate()

  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [noteCategory, setNoteCategory] = useState('')
  const [tagsList, setTagsList] = useState([])

  // newTagText — what the user is typing in the tag input box before pressing Add/Enter
  const [newTagText, setNewTagText] = useState('')
  const [titleErrorMessage, setTitleErrorMessage] = useState('')
  const [isLoadingNote, setIsLoadingNote] = useState(true)

  // isSavingNote — true while the PUT request is in progress
  // Disables the save button and shows "Saving..." text
  const [isSavingNote, setIsSavingNote] = useState(false)

 
  /**
   Runs loadExistingNote() when the component first mounts
   [id] as dependency means it also re-runs if the URL id ever changes
  */
  useEffect(() => {
    loadExistingNote()
  }, [id])


  /**
   loadExistingNote — fetches the note from the backend and populates the form
  */
  async function loadExistingNote() {
    try {
      const response = await getNote(id) // from services/api.js → GET /api/notes/:id
      const existingNote = response.data.data // the note object from backend

      // Pre-fill all form fields with the note's current values
      setNoteTitle(existingNote.title)
      setNoteContent(existingNote.content)
      setNoteCategory(existingNote.category || '') 
      setTagsList(existingNote.tags || [])        
    } catch (error) {
      toast.error('Note not found')
      navigate('/')
    }
    setIsLoadingNote(false) 
  }

  /*
   addTagToList — adds the current newTagText value to the tagsList array
  */
  function addTagToList() {
    const trimmedTag = newTagText.trim()
    if (!trimmedTag) return
    if (tagsList.includes(trimmedTag)) { setNewTagText(''); return } // skip duplicates
    setTagsList([...tagsList, trimmedTag])
    setNewTagText('')
  }

 
  function removeTagFromList(tagToRemove) {
    setTagsList(tagsList.filter((tag) => tag !== tagToRemove))
  }



  async function handleSaveNote(e) {
    e.preventDefault()

    if (!noteTitle.trim()) {
      setTitleErrorMessage('Title is required')
      return
    }

    setIsSavingNote(true) 
    try {
      const updatedData = {
        title: noteTitle.trim(),   // trim whitespace before saving
        content: noteContent,
        tags: tagsList,            // full updated tags array
        category: noteCategory,    // empty string if no category selected
      }
      await updateNote(id, updatedData) 
      toast.success('Note updated!')
      navigate(`/notes/${id}`) 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update note')
    }
    setIsSavingNote(false)
  }


  if (isLoadingNote) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-9 h-9 rounded-full border-4 border-purple-800/40 border-t-purple-400 animate-spin" />
        <p className="text-sm text-purple-300/60">Loading note...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white tracking-tight mb-6">Edit Note</h1>

      <form onSubmit={handleSaveNote} className="max-w-2xl space-y-5">

        {/* Pre-filled with noteTitle state (which was loaded from the backend) */}
        <div>
          <label className={labelClass}>
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter note title..."
            value={noteTitle}
            maxLength={200} // matches backend Note.js schema maxlength
            onChange={(e) => { setNoteTitle(e.target.value)
              if (e.target.value.trim()) setTitleErrorMessage('') }}
            className={`${inputClass} ${titleErrorMessage ? 'border-red-400/60 bg-red-500/10' : ''}`}/>

          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-red-400">{titleErrorMessage}</span>
            <span className="text-xs text-purple-400/50">{noteTitle.length}/200</span>
          </div>
        </div>


        {/* ===== CATEGORY FIELD ===== */}
        {/**
         * Pre-filled with noteCategory state (loaded from backend)
         * If the saved note has category "Work", the dropdown shows "Work" selected
         * appearance-none hides the default browser arrow; "▼" is added manually
         */}

        <div>
          <label className={labelClass}>
            Category{' '}
            <span className="text-purple-400/50 font-normal">(optional)</span>
          </label>
          

          <div className="relative">
            <select
              value={noteCategory}
              onChange={(e) => setNoteCategory(e.target.value)}
              className={`${inputClass} appearance-none pr-9 cursor-pointer`}>
              <option value="" style={{ background: '#1a0533', color: '#d4d4d4' }}>— Select a category —</option>
              {categoryList.map((cat) => (
                <option key={cat} value={cat} style={{ background: '#1a0533', color: 'white' }}>{cat}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 text-xs pointer-events-none">▼</span>
          </div>
        </div>


        {/* ===== CONTENT FIELD ===== */}
        {/* Pre-filled with noteContent state (loaded from backend) */}
        <div>
          <label className={labelClass}>Content</label>
          <textarea
            placeholder="Write your note here..."
            value={noteContent}
            rows={10}
            onChange={(e) => setNoteContent(e.target.value)}
            className={`${inputClass} resize-y leading-relaxed`}
          />
        </div>



        {/* ===== TAGS FIELD ===== */}
    
        <div>
          <label className={labelClass}>Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a tag and press Enter..."
              value={newTagText}
              onChange={(e) => setNewTagText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTagToList() } }}
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={addTagToList}
              className="px-4 py-2.5 text-sm font-medium text-purple-200/80 bg-white/[0.07] hover:bg-white/[0.13] border border-purple-600/30 rounded-xl transition-all duration-200 whitespace-nowrap">
              Add
            </button>
          </div>


          {/* Existing and newly added tags shown as removable pill badges */}
          {tagsList.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2.5">
              {tagsList.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-full">
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTagFromList(tag)}
                    className="text-indigo-400/60 hover:text-white transition-colors ml-0.5">
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>


        {/* ===== FORM BUTTONS ===== */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => navigate(`/notes/${id}`)}
            className="px-5 py-2.5 text-sm font-medium text-purple-200/80 bg-white/[0.07] hover:bg-white/[0.13] border border-white/15 rounded-xl transition-all duration-200">
            Cancel
          </button>

        
          <button
            type="submit"
            disabled={isSavingNote}
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-900/40 hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
            {isSavingNote ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </form>
    </div>
  )
}

export default EditNotePage
