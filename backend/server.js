import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/dbConnection.js';
import notesRouter from './routes/notes.route.js';
import path from 'path';


dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notes', notesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Notes API is running' });
});


app.use(express.static(path.join(__dirname, 'frontend/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'))
})


// Connect DB then start server
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });

    server.on('error', (error) => {
      console.error('❌ Server Error:', error);
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Failed:', error);
    process.exit(1);
  });
