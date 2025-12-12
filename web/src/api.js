const API = (base = import.meta.env.VITE_API_BASE || 'http://localhost:4000') => {
  const baseUrl = base;
  const opts = (method = 'GET', body = null, withCreds = true) => ({
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    credentials: withCreds ? 'include' : 'omit',
    body: body ? JSON.stringify(body) : undefined
  });

  return {
    register: (username, password) => fetch(baseUrl + '/api/auth/register', opts('POST', { username, password })).then(r => r.json()),
    login: (username, password) => fetch(baseUrl + '/api/auth/login', opts('POST', { username, password })).then(r => r.json()),
    logout: () => fetch(baseUrl + '/api/auth/logout', opts('POST')),
    getPosts: () => fetch(baseUrl + '/api/posts', opts('GET', null)).then(r => r.json()),
    createPost: (url, title) => fetch(baseUrl + '/api/posts', opts('POST', { url, title })).then(r => r.json()),
    deletePost: (id) => fetch(baseUrl + '/api/posts/' + id, opts('DELETE')).then(r => r.json())
  }
}

export default API();
