import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import { Navbar } from '../navbar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { verifyToken } from '../../../services/users/users';
import { addNewProject, deleteProject, fetchAllProjects, updateProject } from '../../../services/projects/projects';
import { MdAddCircleOutline } from "react-icons/md";
import Modal from 'react-modal'
import { Alert, Button, TextField } from '@mui/material'
import { FiDelete } from "react-icons/fi";
import { LuFolderEdit } from "react-icons/lu";

Modal.setAppElement('#root')

export const Dashboard = () => {
    const navigate = useNavigate()
    const [projects, setProjects] = useState([]) 
    const [modalOpen, setModalOpen] = useState(false)
    const [modalEditOpen, setModalEditOpen] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [title, setTitle] = useState("")
    const [editTitle, setEditTitle] = useState("") 
    const [currentProject, setCurrentProject] = useState(null)
    const [errorMessage, setErrorMessage] = useState("")

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
                const projectsData = Array.isArray(response.data) ? response.data : []
                const filteredProjects = projectsData.filter(project => project.user_email === userEmail)
                setProjects(filteredProjects)
            } catch (error) {
                console.error('Erro ao buscar projetos:', error)
                setProjects([])
            }
        }

        fetchProjects()
    }, [navigate])

    const updatePage = async () => {
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
            const projectsData = Array.isArray(response.data) ? response.data : []
            const filteredProjects = projectsData.filter(project => project.user_email === userEmail)
            setProjects(filteredProjects)
        } catch (error) {
            console.error('Erro ao buscar projetos:', error)
            setProjects([])
        }
    }

    const handleAddProject = async (event) => {
        event.preventDefault()
        const email = localStorage.getItem('email')

        try {
            const response = await addNewProject(title, email)
            const projectsData = Array.isArray(response.data) ? response.data : []
            setProjects(projectsData)
            setModalOpen(false)
            setSuccessMessage("Novo projeto adicionado")
            setErrorMessage("")
            setTitle("")
            
            setTimeout(() => {
                setSuccessMessage("")
            }, 2000)

            await updatePage()
        } catch (error) {
            setErrorMessage("Por favor, verifique os campos")
            
            setTimeout(() => {
                setErrorMessage("")
            }, 2000)

            setSuccessMessage("")
        }
    }

    const handleOpenEditModal = (project) => {
        setCurrentProject(project)
        setEditTitle(project.title) 
        setModalEditOpen(true)
    }

    const handleEditProject = async (event) => {
        event.preventDefault()

        try {
            await updateProject(currentProject.id,  editTitle , currentProject.user_email, currentProject.columns)
            setModalEditOpen(false)
            setSuccessMessage("Projeto atualizado")
            setErrorMessage("")
            
            setTimeout(() => {
                setSuccessMessage("")
            }, 2000)

            await updatePage()
        } catch (error) {
            setErrorMessage("Erro ao atualizar o projeto")
            
            setTimeout(() => {
                setErrorMessage("")
            }, 2000)

            setSuccessMessage("")
        }
    }

    const handleDeleteProject = async (id) => {
        try {
            await deleteProject(id)
            setSuccessMessage("Projeto Deletado")
            setErrorMessage("")
            setTimeout(() => {
                setSuccessMessage("")
            }, 2000)
            await updatePage()

        } catch (error) {
            setErrorMessage("Por favor, verifique os campos")
            
            setTimeout(() => {
                setErrorMessage("")
            }, 2000)

            setSuccessMessage("")
        }
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <MdAddCircleOutline className='icon-add' onClick={() => setModalOpen(true)} title='Adicionar um novo Projeto'/>
                </div>
                <h1 className='title-dashboard'>Seus Projetos</h1>
                <Navbar />
                <div className="alert-container">
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                </div>
                <div className='projects-container'>
                    {projects.map(project => (
                        <div key={project.id} className="project">
                            <div className='icon-container'>
                                <LuFolderEdit className='icon-edit'  onClick={() => handleOpenEditModal(project)}/>
                                <FiDelete className='icon-delete' onClick={() => handleDeleteProject(project.id)}/>
                            </div>
                            <Link to={`/kanban/${project.id}`}>
                                <p>{project.title}</p>
                            </Link>
                        </div>
                    ))}
                </div>
                <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} contentLabel='Adicionar um novo Projeto' className="modal" overlayClassName="modal-overlay">
                    <form onSubmit={handleAddProject}>
                        <TextField type='text' label="Nome do projeto" value={title} variant="filled" onChange={(e) => setTitle(e.target.value)} required fullWidth />
                        <Button type='submit'>Adicionar</Button>
                        <Button type='button' onClick={() => setModalOpen(false)}>Cancelar</Button>
                    </form>
                </Modal>
                <Modal isOpen={modalEditOpen} onRequestClose={() => setModalEditOpen(false)} contentLabel='Editar Projeto' className="modal" overlayClassName="modal-overlay">
                    <form onSubmit={handleEditProject}>
                        <TextField type='text' label="Nome do projeto" value={editTitle} variant="outlined" onChange={(e) => setEditTitle(e.target.value)} required fullWidth />
                        <Button type='submit'>Salvar</Button>
                        <Button type='button' onClick={() => setModalEditOpen(false)}>Cancelar</Button>
                    </form>
                </Modal>
            </div>
        </div>
    )
}
