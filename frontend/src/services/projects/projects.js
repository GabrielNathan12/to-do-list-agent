import { apiProjects } from '../api/api'

export const fetchAllProjects = () => {
    return apiProjects.get('', {})
}

export const fetchProjectById = (id) => {
    return apiProjects.get(`/${id}`)
}
