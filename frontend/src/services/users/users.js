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
