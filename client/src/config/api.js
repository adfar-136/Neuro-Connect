// API Configuration
export const API_BASE_URL = 'https://neuroconnectserver.onrender.com';

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Socket.io configuration
export const SOCKET_URL = 'https://neuroconnectserver.onrender.com';
