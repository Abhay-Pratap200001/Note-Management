<div align="center">

# 📒 Notes Manager

### A full-stack MERN Notes Management System with a sleek dark glassmorphism UI

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

### 🌐 [Live Demo → note-management-avse.onrender.com](https://note-management-avse.onrender.com/)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📝 **Create Notes** | Add notes with title, content, tags, and category |
| 📌 **Pin Notes** | Pin important notes to keep them at the top |
| 🔍 **Search Notes** | Real-time full-text search across title and content |
| 🏷️ **Tags** | Comma-separated tags for easy organization |
| 🗂️ **Categories** | 8 preset categories — Personal, Work, Study, Ideas, and more |
| ✏️ **Edit Notes** | Update any field on an existing note |
| 🗑️ **Delete Notes** | Safe delete with a confirmation dialog |
| 🎨 **Glassmorphism UI** | Dark purple theme with frosted glass cards |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |
| 🔔 **Toast Notifications** | Instant feedback on every action |
| 📅 **Auto Date** | Footer shows live auto-updating current date |

---

## 🗺️ Flow Diagrams

### 1️⃣ System Architecture — How the App Works

```mermaid
graph TD
    User(["👤 User / Browser"])

    subgraph Frontend ["⚛️ React Frontend — Vite :5173"]
        Pages["Pages\nHomePage · CreateNotePage\nNoteDetailPage · EditNotePage"]
        Components["Components\nNoteCard · ConfirmDialog · Footer"]
        AxiosService["services/api.js\nAxios HTTP Client"]
    end

    subgraph Backend ["🟢 Express Backend — Node.js :2000"]
        Router["Routes\n/api/notes"]
        Controller["noteController.js\nCRUD Logic + Validation"]
        Model["note.model.js\nMongoose Schema"]
    end

    DB[("🍃 MongoDB Atlas\nCloud Database")]

    User -->|"Clicks / Types"| Pages
    Pages --> Components
    Pages -->|"getNote · createNote\nupdateNote · deleteNote"| AxiosService
    AxiosService -->|"HTTP Request\nGET POST PUT DELETE /api/notes"| Router
    Router --> Controller
    Controller -->|"Mongoose Query"| Model
    Model -->|"Read / Write"| DB
    DB -->|"Documents"| Model
    Model -->|"Result"| Controller
    Controller -->|"JSON Response\n{ success, data }"| AxiosService
    AxiosService -->|"Response Data"| Pages
    Pages -->|"Re-render UI\n+ Toast Notification"| User
```

---

### 2️⃣ User Flow — Every Page & Action

```mermaid
flowchart TD
    Start(["🚀 Open App"])
    Home["🏠 Home Page\nAll Notes Grid"]
    Search["🔍 Type in Search Bar\nGET /api/notes?search=keyword"]
    Results["📋 Filtered Notes Grid"]

    NewBtn["➕ Click New Note"]
    CreatePage["📝 Create Note Page\nFill: title · content · tags · category"]
    CreateSave{"Click Save?"}
    PostAPI(["POST /api/notes ✅\nRedirect → Home"])

    ClickCard["🖱️ Click a Note Card"]
    DetailPage["📄 Note Detail Page\nFull view: title · content · tags · date"]

    PinBtn["📌 Pin / Unpin"]
    PinAPI(["PUT /api/notes/:id\nisPinned toggled ✅"])

    EditBtn["✏️ Click Edit"]
    EditPage["📝 Edit Note Page\nPre-filled form"]
    EditSave{"Save Changes?"}
    PutAPI(["PUT /api/notes/:id ✅\nRedirect → Detail"])

    DeleteBtn["🗑️ Click Delete"]
    Dialog["⚠️ Confirm Dialog\nAre you sure?"]
    Confirmed{"Confirmed?"}
    DeleteAPI(["DELETE /api/notes/:id ✅\nRedirect → Home"])
    Cancelled["Stay on Detail Page"]

    Back["← Back to Notes"]

    Start --> Home
    Home --> Search --> Results --> ClickCard
    Home --> NewBtn --> CreatePage --> CreateSave
    CreateSave -->|"Yes"| PostAPI
    CreateSave -->|"No / Back"| Home

    Home --> ClickCard --> DetailPage
    DetailPage --> PinBtn --> PinAPI --> DetailPage
    DetailPage --> EditBtn --> EditPage --> EditSave
    EditSave -->|"Yes"| PutAPI
    EditSave -->|"No / Back"| DetailPage

    DetailPage --> DeleteBtn --> Dialog --> Confirmed
    Confirmed -->|"Yes"| DeleteAPI
    Confirmed -->|"No"| Cancelled --> DetailPage
    DetailPage --> Back --> Home
```

---

### 3️⃣ API Request Lifecycle — Request to Response

```mermaid
sequenceDiagram
    actor U as 👤 User
    participant R as ⚛️ React Page
    participant A as 📡 Axios (api.js)
    participant E as 🟢 Express Router
    participant C as 🧠 Controller
    participant M as 🍃 Mongoose Model
    participant DB as 💾 MongoDB Atlas

    U->>R: Perform action (create / edit / delete / search)
    R->>A: Call API function e.g. createNote(data)
    A->>E: HTTP Request → POST /api/notes

    E->>C: Route matched → noteController.createNote()
    C->>C: Validate input (title required?)

    alt Validation fails
        C-->>A: 400 Bad Request { success: false, message }
        A-->>R: Error caught in catch block
        R-->>U: 🔴 Toast — "Title is required"
    else Validation passes
        C->>M: new Note(data).save()
        M->>DB: Insert document
        DB-->>M: Saved document + _id + timestamps
        M-->>C: Mongoose document
        C-->>A: 201 Created { success: true, data: note }
        A-->>R: response.data
        R-->>U: ✅ Toast — "Note created" + UI updates
    end
```

---

## 🛠️ Tech Stack

### Frontend
| Package | Version | Purpose |
|---|---|---|
| React | ^18 | UI library |
| React Router DOM | ^7 | Client-side routing |
| Tailwind CSS | ^4 | Utility-first styling |
| Vite | ^8 | Build tool & dev server |
| Axios | ^1 | HTTP requests |
| react-hot-toast | ^2 | Toast notifications |
| Google Fonts — Poppins | 300–700 | Typography |

### Backend
| Package | Version | Purpose |
|---|---|---|
| Node.js | ≥18 | Runtime |
| Express | ^4 | REST API server |
| Mongoose | ^8 | MongoDB ODM |
| dotenv | ^16 | Environment variables |
| cors | ^2 | Cross-origin requests |
| nodemon | ^3 | Dev hot-reload |

---

## 📁 Project Structure

```
Notes-Management/
│
├── backend/                        # Express REST API
│   │
│   ├── models/                     # Mongoose schemas (Database layer)
│   │   └── note.model.js           # Note schema — title, content, tags, category, isPinned
│   │
│   ├── routes/                     # API route definitions
│   │   └── notes.route.js          # Maps URL paths to controller functions
│   │
│   ├── controllers/                # Business logic (CRUD operations)
│   │   └── noteController.js       # Create · Read · Update · Delete · Search
│   │
│   └── server.js                   # App entry point — Express setup + DB connection
│
├── frontend/                       # React + Vite frontend
│   │
│   ├── index.html                  # Root HTML — Google Fonts (Poppins) link
│   │
│   └── src/
│       │
│       ├── pages/                  # Full page components (one per route)
│       │   ├── HomePage.jsx        # "/"             — search bar + notes grid
│       │   ├── CreateNotePage.jsx  # "/notes/new"    — create note form
│       │   ├── NoteDetailPage.jsx  # "/notes/:id"    — full note detail view
│       │   └── EditNotePage.jsx    # "/notes/:id/edit" — pre-filled edit form
│       │
│       ├── components/             # Reusable UI components
│       │   ├── NoteCard.jsx        # Single note card shown in the grid
│       │   ├── ConfirmDialog.jsx   # Delete confirmation modal
│       │   └── Footer.jsx          # Footer with auto-updating live date
│       │
│       ├── services/               # All Axios API call functions
│       │   └── api.js              # getNotes · getNote · createNote · updateNote · deleteNote
│       │
│       ├── App.jsx                 # Router setup · header · layout wrapper
│       ├── main.jsx                # React DOM entry point
│       └── index.css               # Tailwind import · Poppins font · custom scrollbar
│
├── package.json                    # Root scripts — build & start (used by Render)
├── .env                            # MONGO_URI · PORT  (not committed to git)
└── README.md
```

# 📸 Screenshots

| Home Page | 
<img width="1090" height="917" alt="image" src="https://github.com/user-attachments/assets/58de40bf-1520-463b-a957-1db046f01f69" />


|Create Note |
<img width="1125" height="925" alt="image" src="https://github.com/user-attachments/assets/8064f977-3e43-4d7c-b41b-d7b1010343a4" />


|Single Note |
<img width="1347" height="927" alt="image" src="https://github.com/user-attachments/assets/e658fdf0-550a-4e03-b8d2-6daeacd61580" />

---

## 🚀 Getting Started — Local Development

### Prerequisites
- [Node.js](https://nodejs.org) ≥ 18
- [MongoDB](https://mongodb.com) (local or [Atlas](https://cloud.mongodb.com) cloud cluster)

### 1. Clone the repository

```bash
git clone https://github.com/Abhay-Pratap200001/Note-Management.git
cd Note-Management
```

### 2. Install dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
npm install --prefix frontend
```

### 3. Configure environment variables

Create a `.env` file in the **root** of the project:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/notes-db
PORT=2000
```

### 4. Run the development servers

**Option A — PowerShell script (Windows)**
```powershell
.\start.ps1
```

**Option B — Two separate terminals**
```bash
# Terminal 1 — Backend (runs on http://localhost:2000)
npm run dev

# Terminal 2 — Frontend (runs on http://localhost:5173)
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

> The Vite dev server proxies all `/api` requests to `http://localhost:2000`, so no CORS issues in development.

---

## 🔌 API Endpoints

Base URL (production): `https://<your-render-app>.onrender.com`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check — returns server status |
| `GET` | `/api/notes` | Get all notes (supports `?search=keyword`) |
| `POST` | `/api/notes` | Create a new note |
| `GET` | `/api/notes/:id` | Get a single note by ID |
| `PUT` | `/api/notes/:id` | Update a note (partial update supported) |
| `DELETE` | `/api/notes/:id` | Delete a note |

### Example Request — Create Note

```json
POST /api/notes
Content-Type: application/json

{
  "title": "My First Note",
  "content": "This is the note body...",
  "tags": ["react", "mern"],
  "category": "Study",
  "isPinned": false
}
```

### Example Response

```json
{
  "success": true,
  "data": {
    "_id": "664f2a...",
    "title": "My First Note",
    "content": "This is the note body...",
    "tags": ["react", "mern"],
    "category": "Study",
    "isPinned": false,
    "createdAt": "2026-05-10T10:00:00.000Z",
    "updatedAt": "2026-05-10T10:00:00.000Z"
  }
}
```

---

## 🗄️ Data Model

```js
// backend/models/note.model.js
{
  title:     { type: String, required: true, maxlength: 200, trim: true },
  content:   { type: String, trim: true, default: '' },
  tags:      { type: [String], default: [] },
  category:  { type: String, trim: true, default: '' },
  isPinned:  { type: Boolean, default: false },
  createdAt: Date,   // auto — mongoose timestamps
  updatedAt: Date    // auto — mongoose timestamps
}
```

Text index on `title` + `content` enables full-text search via `?search=`.

---

## ☁️ Deployment — Render

This project is configured for one-service deployment on [Render](https://render.com) — the Express backend serves the built React frontend as static files.

### Render Settings

| Setting | Value |
|---|---|
| **Environment** | Node |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |
| **Root Directory** | *(leave blank — repo root)* |

### Root `package.json` scripts

```json
{
  "build": "npm install && npm install --prefix frontend && npm run build --prefix frontend",
  "start": "node backend/server.js"
}
```

### Environment Variables (set in Render dashboard)

```
MONGO_URI = mongodb+srv://...
PORT      = 2000
NODE_ENV  = production
```

---

## 🎨 UI Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Search bar + responsive note grid with pin/delete actions |
| `/notes/new` | Create Note | Form with title, content, tags, category dropdown |
| `/notes/:id` | Note Detail | Full note view with pin toggle, edit, and delete |
| `/notes/:id/edit` | Edit Note | Pre-filled form for updating an existing note |

---

## 📦 Available Scripts

### Root (Backend)
```bash
npm run dev     # Start backend with nodemon (hot-reload)
npm start       # Start backend with node (production)
npm run build   # Install all deps + build frontend (used by Render)
```

### Frontend (`cd frontend`)
```bash
npm run dev     # Start Vite dev server on :5173
npm run build   # Build for production → frontend/dist/
npm run preview # Preview the production build locally
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it for personal or commercial projects.

---

<div align="center">

Made with 💜 by **Abhay Pratap**

[![GitHub](https://img.shields.io/badge/GitHub-Abhay--Pratap200001-181717?style=flat-square&logo=github)](https://github.com/Abhay-Pratap200001)

</div>

