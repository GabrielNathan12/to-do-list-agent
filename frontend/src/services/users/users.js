import { apiUsers } from '../api/api'

export const login = (email, password) => {
  return apiUsers.post('/login', {
    "email": email,
    "password": password
  })
}

export const register = (name, email, password) => {
  return apiUsers.post('', {
    "name": name,
    "email": email,
    "password": password
  })
}
export const verifyToken = async (token) => {
    try {
      const response = await apiUsers.post('/verify', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.status === 200;
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 403)) {
        return false;
      }
      throw error;
    }
};

export const fetchAllUsers = async () => {
  return apiUsers.get('')
}

export const updateUser = async (id, name, email, password) => {
  return apiUsers.put(`/${id}`, {
    "name": name, 
    "email": email,
    "password": password
  })
}

export const deleteUser = async (id) => {
  return apiUsers.delete(`/${id}`)
}