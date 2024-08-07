import "./Kanban.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Navbar } from "../navbar/Navbar";
import { fetchAllTasks, updateTask } from "../../../services/tasks/tasks";
import { verifyToken } from '../../../services/users/users';
import { fetchProjectById, updateProject } from "../../../services/projects/projects";
import { MdAddCircleOutline, MdOutlineDeleteSweep } from "react-icons/md";
import { HiOutlineFolderAdd } from "react-icons/hi";
import { IoAdd } from "react-icons/io5";
import { Button, TextField } from '@mui/material';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export const Kanban = () => {
    const { id: kanbanId } = useParams();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [columns, setColumns] = useState([]);
    const [column, setColumn] = useState("");
    const [editingColumnIndex, setEditingColumnIndex] = useState(null);
    const [newColumnName, setNewColumnName] = useState("");

    useEffect(() => {
        const fetchTasksAndProject = async () => {
            const token = localStorage.getItem('token');
            const userEmail = localStorage.getItem('email');

            if (!token || !userEmail) {
                return navigate('/');
            }

            const isValidToken = await verifyToken(token);

            if (!isValidToken) {
                return navigate('/');
            }

            try {
                const tasksResponse = await fetchAllTasks();
                const filteredTasks = tasksResponse.data.filter(task => 
                    task.user_email === userEmail && task.project_id === kanbanId
                );
                setTasks(filteredTasks);

                const projectResponse = await fetchProjectById(kanbanId);
                setProject(projectResponse.data);
                setColumns(projectResponse.data.columns || []);
            } catch (error) {
                console.error('Erro ao buscar tarefas ou projeto:', error);
            }
        };

        fetchTasksAndProject();
    }, [kanbanId, navigate]);

    const getTasksForColumn = (columnIndex) => {
        return tasks.filter(task => task.column === columnIndex);
    };

    const handleOnDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
    
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    
        const taskId = draggableId;
        const newColumnIndex = parseInt(destination.droppableId, 10);
    
        const taskToUpdate = tasks.find(task => task.id === taskId);
        if (!taskToUpdate) return;
    
        const updatedTask = {
            ...taskToUpdate,
            column: newColumnIndex
        };
    
        try {
            await updateTask(
                updatedTask.id,
                updatedTask.title,
                updatedTask.column,
                updatedTask.description,
                updatedTask.created_date,
                updatedTask.is_finihed,
                updatedTask.priority,
                updatedTask.project_id,
                updatedTask.user_email
            );

            setTasks(prevTasks => {
                const updatedTasks = prevTasks.map(task =>
                    task.id === taskId ? updatedTask : task
                );
                return updatedTasks;
            });
        } catch (error) {
            console.error('Erro ao atualizar a tarefa:', error);
        }
    };

    const handleDeleteColumn = async (columnIndex) => {
        const userEmail = localStorage.getItem('email');

        const updatedColumns = columns.filter((_, index) => index !== columnIndex);

        try {
            await updateProject(project.id, project.title, userEmail, updatedColumns);
            setColumns(updatedColumns);
        } catch (error) {
            console.error('Erro ao deletar a coluna:', error);
        }
    };

    const handleAddColumn = async (event) => {
        event.preventDefault();
        
        const userEmail = localStorage.getItem('email');

        if (!column || column.trim() === "") {
            return;
        }

        const newColumn = {
            name: column.trim()
        };
        const updatedColumns = [...columns, newColumn];
        
        try {
            await updateProject(project.id, project.title, userEmail, updatedColumns);
            setColumns(updatedColumns);
            setModalOpen(false);

        } catch (error) {
            console.error('Erro ao adicionar a coluna:', error);
        }
    };

    const handleEditColumnName = (index) => {
        setEditingColumnIndex(index);
        setNewColumnName(columns[index].name);
    };

    const handleSaveColumnName = async (index) => {
        const userEmail = localStorage.getItem('email');

        const updatedColumns = columns.map((column, i) => 
            i === index ? { ...column, name: newColumnName } : column
        );

        try {
            await updateProject(project.id, project.title, userEmail, updatedColumns);
            setColumns(updatedColumns);
            setEditingColumnIndex(null);
            setNewColumnName("");
        } catch (error) {
            console.error('Erro ao atualizar o nome da coluna:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <Navbar />
                {project && (
                    <div>
                        <h1>{project.title}</h1>
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <MdAddCircleOutline className='icon-add' onClick={() => setModalOpen(true)} title='Adicionar uma nova Coluna'/>
                </div>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <div className="kanban-board">
                        {columns.map((column, index) => (
                            <Droppable key={index} droppableId={index.toString()}>
                                {(provided) => (
                                    <div
                                        className="kanban-column"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <div className="column-header">
                                            <MdOutlineDeleteSweep 
                                                className='icon-delete' 
                                                title='Excluir coluna' 
                                                onClick={() => handleDeleteColumn(index)}
                                            />
                                            {editingColumnIndex === index ? (
                                                <input 
                                                    type="text" 
                                                    value={newColumnName} 
                                                    onChange={(e) => setNewColumnName(e.target.value)} 
                                                    onBlur={() => handleSaveColumnName(index)} 
                                                    onKeyPress={(e) => e.key === 'Enter' && handleSaveColumnName(index)} 
                                                />
                                            ) : (
                                                <h2 onClick={() => handleEditColumnName(index)}>{column.name}</h2>
                                            )}
                                        </div>
                                        {getTasksForColumn(index).map((task, taskIndex) => (
                                            <Draggable key={task.id} draggableId={task.id.toString()} index={taskIndex}>
                                                {(provided) => (
                                                    <div
                                                        className="kanban-task"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <HiOutlineFolderAdd className='icon-edit'/>
                                                        <h3>{task.title}</h3>
                                                        <p>{task.description}</p>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        <IoAdd className="add-task-icon"/>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            </div>
            <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} contentLabel="Adicionar Nova Coluna" className="modal" overlayClassName="modal-overlay" >
                <form onSubmit={handleAddColumn}>
                    <label>
                        Nome da Coluna:
                        <TextField type="text" value={column} onChange={(e) => setColumn(e.target.value)} required fullWidth/>
                    </label>
                    <Button type="submit">Adicionar</Button>
                    <Button type="button" onClick={() => setModalOpen(false)}>Cancelar</Button>
                </form>
            </Modal>
        </div>
    );
};
