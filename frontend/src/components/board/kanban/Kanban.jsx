import "./Kanban.css"
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Navbar } from "../navbar/Navbar";
import { fetchAllTasks } from "../../../services/tasks/tasks";
import { verifyToken } from '../../../services/users/users';
import { fetchProjectById } from "../../../services/projects/projects";

export const Kanban = () => {
    const { id: kanbanId } = useParams()
    const navigate = useNavigate()

    const [project, setProject] = useState(null)
    const [tasks, setTasks] = useState([])
    const [columns, setColumns] = useState([])

    useEffect(() => {
        const fetchTasksAndProject = async () => {
            const token = localStorage.getItem('token')
            const userEmail = localStorage.getItem('email')

            if (!token || !userEmail) {
                return navigate('/')
            }

            const isValidToken = await verifyToken(token);

            if (!isValidToken) {
                return navigate('/')
            }

            try {
                const tasksResponse = await fetchAllTasks()
                const filteredTasks = tasksResponse.data.filter(task => 
                    task.user_email === userEmail && task.project_id === kanbanId
                )
                setTasks(filteredTasks)

                const projectResponse = await fetchProjectById(kanbanId)
                setProject(projectResponse.data)
                setColumns(projectResponse.data.columns || [])
            } catch (error) {
                console.error('Erro ao buscar tarefas ou projeto:', error)
            }
        }

        fetchTasksAndProject()
    }, [kanbanId, navigate])

    const getTasksForColumn = (columnIndex) => {
        const tasksForColumn = tasks.filter(task => task.column === columnIndex + 1)
        return tasksForColumn
    }
    const handleOnDragEnd = async (result) => {

    }
    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <Navbar />
                {project && (
                    <div>
                        <h1>{project.title}</h1>
                    </div>
                )}
                <div className="kanban-board">
                    {columns.map((column, index) => (
                        <div key={column.id} className="kanban-column">
                            <h2>{column.name}</h2>
                            {getTasksForColumn(index).map(task => (
                                <div key={task.id} className="kanban-task">
                                    <h3>{task.title}</h3>
                                    <p>{task.description}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
