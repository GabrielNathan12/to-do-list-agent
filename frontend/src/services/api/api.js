import axios from 'axios';

const apiUsers = axios.create({
    baseURL: process.env.REACT_APP_URL_SERVE_USER
});
const apiProjects = axios.create({
    baseURL: process.env.REACT_APP_URL_SERVE_PROJECTS
});
const apiTasks = axios.create({
    baseURL: process.env.REACT_APP_URL_SERVE_TASKS
});
const apiTasksAi = axios.create({
    baseURL: process.env.REACT_APP_URL_SERVE_TASKS_AI
});

export { apiUsers, apiProjects, apiTasks, apiTasksAi };
