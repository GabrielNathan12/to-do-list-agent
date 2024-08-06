import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import { Navbar } from '../navbar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { verifyToken } from '../../../services/users/users';
import { fetchAllProjects } from '../../../services/projects/projects';

export const Dashboard = () => {
    const navigate = useNavigate()
    const [projects, setProjects] = useState([])

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem('token')
            const userEmail = localStorage.getItem('email')

            if (!token || !userEmail) {
                return navigate('/')
            }

            const isValidToken = await verifyToken(token)

            if (!isValidToken) {
                return navigate('/')
            }

            try {
                const response = await fetchAllProjects()
                const filteredProjects = response.data.filter(project => project.user_email === userEmail)
                setProjects(filteredProjects)
            } catch (error) {
                console.error('Erro ao buscar projetos:', error)
            }
        }

        fetchProjects()
    },[navigate])

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <h1 className='title-dashboard'>Seus Projetos</h1>
                <Navbar />
                <div className='projects-container'>
                    {projects.map(project => (
                        <div key={project.id} className="project">
                            <Link to={`/kanban/${project.id}`}>
                                <p>{project.title}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
