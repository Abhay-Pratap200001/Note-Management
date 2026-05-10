import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const getNotes = (search = '') =>
  api.get(`/notes${search ? `?search=${encodeURIComponent(search)}` : ''}`);

export const getNote = (id) => api.get(`/notes/${id}`);

export const createNote = (data) => api.post('/notes', data);

export const updateNote = (id, data) => api.put(`/notes/${id}`, data);

export const deleteNote = (id) => api.delete(`/notes/${id}`);
