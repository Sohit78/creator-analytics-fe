import { clearStoredAuth, getToken } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

async function apiFetch(path, options = {}) {
  const headers = {
    ...(options.headers || {})
  };

  const token = getToken();
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredAuth();
    }

    throw new Error(payload.message || "Request failed");
  }

  return payload;
}

export const api = {
  register: (data) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  me: () => apiFetch("/auth/me"),
  logout: () => apiFetch("/auth/logout", { method: "POST" }),

  listUsers: () => apiFetch("/users"),
  disableUser: (id) => apiFetch(`/users/${id}/disable`, { method: "PATCH" }),

  createCreator: (data) => apiFetch("/creators", { method: "POST", body: JSON.stringify(data) }),
  listCreators: () => apiFetch("/creators"),
  getCreator: (id) => apiFetch(`/creators/${id}`),
  updateCreator: (id, data) => apiFetch(`/creators/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCreator: (id) => apiFetch(`/creators/${id}`, { method: "DELETE" }),

  uploadCreatorImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return apiFetch("/upload/creator-image", {
      method: "POST",
      body: formData
    });
  },

  dashboardAnalytics: () => apiFetch("/analytics/dashboard"),
  creatorAnalytics: (creatorId) => apiFetch(`/analytics/creator/${creatorId}`),
  refreshCreatorAnalytics: (creatorId) => apiFetch(`/analytics/refresh/${creatorId}`, { method: "POST" })
};
