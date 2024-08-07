import { apiTasks, apiTasksAi } from '../api/api'

export const fetchAllTasks = () => {
    return apiTasks.get('', {})
}

export const updateTask = (id, title, column, description, created_date, is_finihed, priority, project_id, user_email) => {
    return apiTasks.put('',{
            "id": id,
            "title": title,
            "column": column,
            "description": description,
            "created_date": created_date,
            "is_finihed": is_finihed,
            "priority": priority,
            "project_id": project_id,
            "user_email": user_email
    })
}

export const createTask = (title, column, description, is_finihed, priority, project_id, user_email) => {
    return apiTasks.post('', {
            "title": title,
            "column": column,
            "description": description,
            "is_finihed": is_finihed,
            "priority": priority,
            "project_id": project_id,
            "user_email": user_email
    })
}

export const deleteTask = (idTask) => {
    return apiTasks.delete('', {
        data: {id: idTask}
    })
}

export const responseAiTask = (title, description) => {
    return apiTasksAi.post('',
        {"title": title, "description":description}
    )
}