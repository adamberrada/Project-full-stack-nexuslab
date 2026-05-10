// // src/api/client.js
// const API_BASE = ''; // empty because proxy handles the full URL

// async function apiCall(path, options = {}) {
//   const defaultHeaders = {
//     'Content-Type': 'application/json',
//   };
  
//   // If we have a logged-in user, send userId in headers (simple session)
//   const userId = localStorage.getItem('userId');
//   if (userId) {
//     defaultHeaders['X-User-Id'] = userId;
//   }

//   const config = {
//     ...options,
//     headers: {
//       ...defaultHeaders,
//       ...options.headers,
//     },
//   };

//   const response = await fetch(`${API_BASE}${path}`, config);
  
//   // If response is not OK (4xx or 5xx), throw error with backend message
//   if (!response.ok) {
//     let errorMessage = `HTTP ${response.status}`;
//     try {
//       const errorData = await response.json();
//       errorMessage = errorData.message || errorMessage;
//     } catch (e) {
//       // ignore if response body isn't JSON
//     }
//     throw new Error(errorMessage);
//   }
  
//   // For 204 No Content, return null
//   if (response.status === 204) return null;
  
//   return response.json();
// }

// export default {
//   get: (path) => apiCall(path, { method: 'GET' }),
//   post: (path, body) => apiCall(path, { method: 'POST', body: JSON.stringify(body) }),
//   put: (path, body) => apiCall(path, { method: 'PUT', body: JSON.stringify(body) }),
//   delete: (path) => apiCall(path, { method: 'DELETE' }),
// };