/**
 * API Client wrapper with automatic JWT token attachment and error handling.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

export async function apiClient(endpoint, { method = "GET", body = null, headers = {}, ...customConfig } = {}) {
  const token = localStorage.getItem("legal_ai_token");

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const workspaceId = localStorage.getItem("legal_ai_workspace_id");
  if (workspaceId) {
    defaultHeaders["x-workspace-id"] = workspaceId;
  }

  const config = {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...customConfig,
  };

  if (body && !(body instanceof FormData)) {
    config.body = JSON.stringify(body);
  } else if (body instanceof FormData) {
    // Let browser set multipart content-type boundary
    delete config.headers["Content-Type"];
    config.body = body;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.detail || `Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json().catch(() => ({}));
}

export const api = {
  get: (endpoint, options) => apiClient(endpoint, { method: "GET", ...options }),
  post: (endpoint, body, options) => apiClient(endpoint, { method: "POST", body, ...options }),
  put: (endpoint, body, options) => apiClient(endpoint, { method: "PUT", body, ...options }),
  delete: (endpoint, options) => apiClient(endpoint, { method: "DELETE", ...options }),
};

export default api;
