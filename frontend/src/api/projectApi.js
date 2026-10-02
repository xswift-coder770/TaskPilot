import axiosClient from "./axiosClient";

export const projectApi = {
  getProjects: () => axiosClient.get("/projects"),
  getProjectById: (projectId) => axiosClient.get(`/projects/${projectId}`),
  createProject: (payload) => axiosClient.post("/projects", payload),
  updateProject: (projectId, payload) =>
    axiosClient.put(`/projects/${projectId}`, payload),
  deleteProject: (projectId) => axiosClient.delete(`/projects/${projectId}`),

  // Member Management Endpoints
  getProjectMembers: (projectId) =>
    axiosClient.get(`/projects/${projectId}/members`),
  addMember: (projectId, payload) =>
    axiosClient.post(`/projects/${projectId}/members`, payload),
  updateMemberRole: (projectId, userId, newRole) =>
    axiosClient.put(`/projects/${projectId}/members/${userId}`, { newRole }),
  deleteMember: (projectId, userId) =>
    axiosClient.delete(`/projects/${projectId}/members/${userId}`),
};

export default projectApi;