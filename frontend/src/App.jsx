import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Page components — each one represents a full page/screen
import HomePage from './pages/HomePage'             // "/" — shows all notes in a grid
import CreateNotePage from './pages/CreateNotePage'  // "/notes/new" — form to create a new note
import NoteDetailPage from './pages/NoteDetailPage'  // "/notes/:id" — shows one note in full detail
import EditNotePage from './pages/EditNotePage'      // "/notes/:id/edit" — form to edit an existing note

import Footer from './components/Footer'

function App() {
  return (
    <BrowserRouter>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a0533] via-purple-950 to-indigo-950">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <header className="sticky top-0 z-50 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/30 shadow-lg shadow-black/40">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

            <NavLink to="/" className="flex items-center gap-2">
              <span className="text-xl">📒</span>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Notes Manager
              </span>
            </NavLink>

            <div className="flex items-center gap-3">

      
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 border ${
                    isActive
                      ? 'text-white bg-white/10 border-purple-400/40'            // active style
                      : 'text-purple-300 hover:text-white hover:bg-white/10 border-transparent' // default style
                  }`
                }
              >
                All Notes
              </NavLink>

              <NavLink
                to="/notes/new"
                className="px-5 py-2 text-sm font-semibold text-white rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-900/50 hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
              >
                + New Note
              </NavLink>

            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <Routes>
              {/* "/" — Shows the list of all notes → renders HomePage.jsx */}
              <Route path="/" element={<HomePage />} />

              {/* "/notes/new" — Shows create note form → renders CreateNotePage.jsx */}
              <Route path="/notes/new" element={<CreateNotePage />} />

              {/* "/notes/:id" — Shows one note's full detail → renders NoteDetailPage.jsx */}
              {/* ":id" is a URL param — NoteDetailPage reads it using useParams() */}
              <Route path="/notes/:id" element={<NoteDetailPage />} />

              {/* "/notes/:id/edit" — Shows edit form for one note → renders EditNotePage.jsx */}
              {/* ":id" is the same MongoDB _id of the note */}
              <Route path="/notes/:id/edit" element={<EditNotePage />} />

              {/* Catch-all — any unknown URL shows a 404 message */}
              <Route
                path="*"
                element={
                  <div className="text-center py-20">
                    <h2 className="text-xl font-semibold text-purple-300">404 — Page not found</h2>
                  </div>
                }
              />
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
