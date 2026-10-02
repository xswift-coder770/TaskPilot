import axiosClient from "./axiosClient";

export const taskApi = {
  getTasks: (projectId) => axiosClient.get(`/tasks/${projectId}`),
  getTaskById: (projectId, taskId) =>
    axiosClient.get(`/tasks/${projectId}/t/${taskId}`),

  createTask: (projectId, formData) =>
    axiosClient.post(`/tasks/${projectId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateTask: (projectId, taskId, formData) =>
    axiosClient.put(`/tasks/${projectId}/t/${taskId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteTask: (projectId, taskId) =>
    axiosClient.delete(`/tasks/${projectId}/t/${taskId}`),

  // Subtasks
  createSubtask: (projectId, taskId, payload) =>
    axiosClient.post(`/tasks/${projectId}/t/${taskId}/subtasks`, payload),
  updateSubtask: (projectId, subtaskId, payload) =>
    axiosClient.put(`/tasks/${projectId}/st/${subtaskId}`, payload),
  deleteSubtask: (projectId, subtaskId) =>
    axiosClient.delete(`/tasks/${projectId}/st/${subtaskId}`),
};