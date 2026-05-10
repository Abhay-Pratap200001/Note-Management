/**
  ConfirmDialog.jsx — A reusable confirmation popup/modal component
 
  Used in:
    HomePage.jsx   → confirms before deleting a note from the grid
    NoteDetailPage.jsx → confirms before deleting a note from the detail view
*/

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    /*
     Clicking the overlay calls onCancel (from the parent) to close the dialog
    */
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      {/*
        Dialog box — the actual white/dark popup in the center
        e.stopPropagation() prevents clicks inside the box from closing the dialog
        (without this, clicking anywhere in the box would trigger the overlay's onClick)
      */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-purple-950/95 border border-purple-700/40 rounded-2xl p-7 max-w-md w-full shadow-2xl shadow-black/50">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-purple-200/70 leading-relaxed mb-6">{message}</p>

        <div className="flex justify-end gap-3">

          {/*
           Cancel button — calls onCancel prop (from parent)
          */}
          <button
            onClick={onCancel}
            className="px-5 py-2 text-sm font-medium text-purple-200/80 bg-white/[0.07] hover:bg-white/[0.13] border border-white/15 rounded-xl transition-all duration-200">
            Cancel
          </button>

          {/*
            Delete button — calls onConfirm prop (from parent)
          */}
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-semibold text-white bg-red-500/70 hover:bg-red-500/90 border border-red-400/30 rounded-xl transition-all duration-200">
            Delete
          </button>

        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
