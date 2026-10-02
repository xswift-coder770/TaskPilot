import axiosClient from "./axiosClient";

export const noteApi = {
  getNotes: (projectId) => axiosClient.get(`/notes/${projectId}`),
  getNoteById: (projectId, noteId) =>
    axiosClient.get(`/notes/${projectId}/n/${noteId}`),
  createNote: (projectId, payload) =>
    axiosClient.post(`/notes/${projectId}`, payload),
  updateNote: (projectId, noteId, payload) =>
    axiosClient.put(`/notes/${projectId}/n/${noteId}`, payload),
  deleteNote: (projectId, noteId) =>
    axiosClient.delete(`/notes/${projectId}/n/${noteId}`),
};