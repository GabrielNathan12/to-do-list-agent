import { apiProjects } from '../api/api'

export const fetchAllProjects = () => {
    return apiProjects.get('', {})
}

export const fetchProjectById = (id) => {
    return apiProjects.get(`/${id}`)
}


export const addNewProject = (title, email) => {
    return apiProjects.post('', {
        "title": title,
        "user_email": email,
        "columns": []
    })
}
export const updateProject = (id, title, user_email, columns) => {
    return apiProjects.put('', {
        "id": id,
        "title": title,
        "user_email": user_email, 
        "columns": columns
    })
}