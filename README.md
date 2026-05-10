<h1 align="center">📝 Notes Manager</h1>

<p align="center">
  A modern full-stack notes application built with the MERN stack.
</p>

<p align="center">
  <img src="./frontend/public/preview.png" width="100%" />
</p>

<p align="center">

  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />

</p>


<p align="center">
  <a href="https://note-management-avse.onrender.com/">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-6C47FF?style=for-the-badge" />
  </a>
</p>

# 📸 Screenshots

| Home Page | 
<img width="1090" height="917" alt="image" src="https://github.com/user-attachments/assets/58de40bf-1520-463b-a957-1db046f01f69" />


|Create Note |
<img width="1125" height="925" alt="image" src="https://github.com/user-attachments/assets/8064f977-3e43-4d7c-b41b-d7b1010343a4" />


|Single Note |
<img width="1347" height="927" alt="image" src="https://github.com/user-attachments/assets/e658fdf0-550a-4e03-b8d2-6daeacd61580" />


## ✨ Features

- 🔍 Real-time search notes
- 📌 Pin important notes
- 🏷️ Tag organization
- 🎨 Beautiful responsive UI
- ⚡ Fast Vite frontend
- 🔐 Secure REST API
- ☁️ Render deployment ready
- 📱 Mobile responsive design
- 🗂️ Category filtering
- 📝 CRUD operations

<details>
<summary>Frontend Stack</summary>

| Tech | Purpose |
|------|---------|
| React | UI Library |
| Vite | Build Tool |
| Tailwind CSS v4 | Styling |
| Axios | API Requests |
</details>


notes-manager/
│
├── backend/              # Express API
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── controllers/      # Business logic
│   └── server.js         # Entry point
│
├── frontend/             # React frontend
│   ├── src/
│   │   ├── pages/        # Application pages
│   │   ├── components/   # Reusable UI
│   │   └── services/     # API calls
│
└── README.md


# Clone repository
git clone https://github.com/Abhay-Pratap200001/Note-Management

# Install dependencies
npm install
cd frontend && npm install

# Run backend
npm run server

# Run frontend
npm run dev


### Create Note

POST `/api/notes`

Request:

```json
{
  "title": "React Tips",
  "content": "Use reusable components",
  "tags": ["react", "frontend"]
}
```

Frontend → Render Static Site  
Backend → Render Web Service  
Database → MongoDB Atlas


# 🚧 Future Improvements

- [ ] Authentication
- [ ] Markdown editor
- [ ] Rich text notes
- [ ] File uploads
- [ ] Collaborative notes
- [ ] AI summarization


<p align="center">
  Made with ❤️ using MERN Stack
</p>
