import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createNote } from "../services/api";

/**
 inputClass — shared Tailwind class string for all input/textarea/select fields
 Defined once here so we don't repeat the same long string on every field
 Applied with template literals:  className={`${inputClass} any-extra-class`}
*/
const inputClass = `w-full px-4 py-2.5 rounded-xl text-sm text-white
  bg-white/[0.07] border border-purple-600/30
  placeholder:text-purple-300/40
  focus:outline-none focus:border-purple-400/70 focus:ring-2 focus:ring-purple-500/20
  transition-all duration-200`;

const labelClass = "block text-sm font-semibold text-purple-200/90 mb-1.5";

const categoryList = [
  "Personal",
  "Work",
  "Study",
  "Ideas",
  "To-Do",
  "Health",
  "Finance",
  "Other",
];

function CreateNotePage() {
  const navigate = useNavigate();


  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteCategory, setNoteCategory] = useState("");

  const [tagsList, setTagsList] = useState([]);

  // newTagText — what the user is typing in the tag input box before they hit Add/Enter
  // Not sent to backend directly — gets pushed into tagsList when added
  const [newTagText, setNewTagText] = useState("");

  const [titleErrorMessage, setTitleErrorMessage] = useState("");

  const [isCreatingNote, setIsCreatingNote] = useState(false);

  
  /**
   addTagToList — adds the current newTagText value to the tagsList array
   Called when user clicks the "Add" button OR presses Enter inside the tag input
  */
  function addTagToList() {
    const trimmedTag = newTagText.trim();
    if (!trimmedTag) return; // do nothing if input is empty
    if (tagsList.includes(trimmedTag)) {
      setNewTagText(""); // clear input but don't add duplicate
      return;
    }
    setTagsList([...tagsList, trimmedTag]); // add tag to the array
    setNewTagText(""); // clear the tag input
  }


  /**
   * removeTagFromList — removes a specific tag from tagsList
   * Called when user clicks the ✕ button on a tag pill
   * tagToRemove is the tag string to filter out
   */
  function removeTagFromList(tagToRemove) {
    setTagsList(tagsList.filter((tag) => tag !== tagToRemove));
  }


  /**
    handleCreateNote — form submit handler
    Called when user clicks Create Note button
    Validates that title is not empty
    Sends POST request to backend with all form data
   
    API: POST /api/notes  →  backend/controllers/noteController.js → createNote()
    On success: navigates to "/notes/:newId" (the detail page for the new note)
   */
  async function handleCreateNote(e) {
    e.preventDefault(); 

    if (!noteTitle.trim()) {
      setTitleErrorMessage("Title is required");
      return;
    }

    setIsCreatingNote(true); // disable submit button while request 

    try {
      const noteData = {
        title: noteTitle.trim(),    // trim removes leading/trailing spaces
        content: noteContent,
        tags: tagsList,             // array of tag strings
        category: noteCategory,     // empty string if no category selected
      };
      const response = await createNote(noteData); // from services/api.js → POST /api/notes
      toast.success("Note created!");

      navigate(`/notes/${response.data.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create note");
    }
    setIsCreatingNote(false); 
  }


  return (
    <div>
      <h1 className="text-2xl font-bold text-white tracking-tight mb-6">
        Create New Note
      </h1>

      <form onSubmit={handleCreateNote} className="max-w-2xl space-y-5">

        <div>
          <label className={labelClass}>
            Title <span className="text-red-400">*</span>
          </label>

          <input
            type="text"
            placeholder="Enter note title..."
            value={noteTitle}       
            maxLength={200}        
            onChange={(e) => {
              setNoteTitle(e.target.value);
              // Clear the error message as soon as user starts typing again
              if (e.target.value.trim()) setTitleErrorMessage("");
            }}
            className={`${inputClass} ${titleErrorMessage ? "border-red-400/60 bg-red-500/10" : ""}`}
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-red-400">{titleErrorMessage}</span>
            {/* Character counter — noteTitle.length updates as user types */}
            <span className="text-xs text-purple-400/50">
              {noteTitle.length}/200
            </span>
          </div>
        </div>


        <div>
          <label className={labelClass}>
            Category{" "}
            <span className="text-purple-400/50 font-normal">(optional)</span>
          </label>
          <div className="relative">

            <select
              value={noteCategory}
              onChange={(e) => setNoteCategory(e.target.value)}
              className={`${inputClass} appearance-none pr-9 cursor-pointer`}>

              {/* Default empty option — when selected, noteCategory = "" */}
              <option
                value="" style={{ background: "#1a0533", color: "#d4d4d4" }}>
                — Select a category —
              </option>

              {/* Render one <option> for each category in the categoryList array */}
              {categoryList.map((cate) => (
                <option
                  key={cate}
                  value={cate}
                  style={{ background: "#1a0533", color: "white" }}
                >
                  {cate}
                </option>
              ))}

            </select>

            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 text-xs pointer-events-none">
              ▼
            </span>
          </div>
        </div>


        {/* ===== CONTENT FIELD ===== */}
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

        <div>
          <label className={labelClass}>Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a tag and press Enter..."
              value={newTagText}
              onChange={(e) => setNewTagText(e.target.value)}
              // {/* Press Enter in the tag input → calls addTagToList() without submitting the form */}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(), addTagToList()}}}
              className={`${inputClass} flex-1`}
            />


            {/* "Add" button manually calls addTagToList() */}
            <button
              type="button" // type="button" is important — prevents this from submitting the form
              onClick={addTagToList}
              className="px-4 py-2.5 text-sm font-medium text-purple-200/80 bg-white/[0.07] hover:bg-white/[0.13] border border-purple-600/30 rounded-xl transition-all duration-200 whitespace-nowrap">
              Add
            </button>
          </div>


          {/* Tag pills — shown only when tagsList has at least one tag */}
          {tagsList.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2.5">
              {tagsList.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-full">
                  #{tag}
                  {/*button — removes this specific tag from tagsList */}
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
          <button type="button" onClick={() => navigate("/")}
            className="px-5 py-2.5 text-sm font-medium text-purple-200/80 bg-white/[0.07] hover:bg-white/[0.13] border border-white/15 rounded-xl transition-all duration-200">
            Cancel
          </button>


          <button type="submit"
            disabled={isCreatingNote}
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-900/40 hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
            {isCreatingNote ? "Creating..." : "Create Note"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateNotePage;
