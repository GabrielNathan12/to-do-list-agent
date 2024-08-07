import "./Kanban.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Navbar } from "../navbar/Navbar";
import { fetchAllTasks, updateTask, createTask, deleteTask } from "../../../services/tasks/tasks";
import { verifyToken } from '../../../services/users/users';
import { fetchProjectById, updateProject } from "../../../services/projects/projects";
import { MdAddCircleOutline, MdOutlineDeleteSweep } from "react-icons/md";
import { FiDelete } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";
import { Button, TextField } from '@mui/material';
import { Checkbox, IconButton } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material'; 
import Modal from 'react-modal';

Modal.setAppElement('#root');

export const Kanban = () => {
    const { id: kanbanId } = useParams();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTaskOpen, setModalTaskOpen] = useState(false);
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [columns, setColumns] = useState([]);
    const [column, setColumn] = useState("");
    const [editingColumnIndex, setEditingColumnIndex] = useState(null);
    const [newColumnName, setNewColumnName] = useState("");
    const [newTask, setNewTask] = useState({ title: "", description: "", columnIndex: null });
    const [errors, setErrors] = useState({});

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
    const handleUpdateWindow = async () => {
        const userEmail = localStorage.getItem('email');


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

    const handleAddTask = (columnIndex) => {
        setNewTask({ title: "", description: "", columnIndex });
        setModalTaskOpen(true);
    };
    
    const handleTaskStatusChange = async (idTask, is_finihed)=> {

    }
    const handleSaveTask = async (event) => {
        event.preventDefault();
        const userEmail = localStorage.getItem('email');

        const newTaskData = {
            ...newTask,
            column: newTask.columnIndex,
            project_id: kanbanId,
            user_email: userEmail
        };

        try {
            const response = await createTask(
                newTaskData.title,
                newTaskData.column,
                newTaskData.description,
                newTaskData.is_finihed,
                newTaskData.priority,
                newTaskData.project_id,
                newTaskData.user_email
            );
            setTasks([...tasks, response.data]);
            setModalTaskOpen(false);
            setNewTask({ title: "", description: "", columnIndex: null });
            await handleUpdateWindow()
            setErrors({});
        } catch (error) {
            console.error('Erro ao adicionar a tarefa:', error);
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            }
        }
    };
    const handleDeleteTasks = async (idTask) => {
        try {
            await deleteTask(idTask)
            await handleUpdateWindow()            

        } catch (error) {
            console.log(error)
        }
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
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <MdAddCircleOutline className='icon-add' onClick={() => setModalOpen(true)} title='Adicionar uma nova Coluna'/>
                </div>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <div className="kanban-board">
                        {columns.length > 0 && columns.map((column, index) => (
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
                                            <Draggable key={task.id} draggableId={task.id ? task.id.toString() : `task-${taskIndex}`} index={taskIndex}>
                                                {(provided) => (
                                                    <div
                                                        className="kanban-task"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                    <Checkbox
                                                        checked={task.is_finihed}
                                                        onChange={(e) => handleTaskStatusChange(task.id, e.target.checked)}
                                                        icon={<Cancel />} // Ícone para não concluído
                                                        checkedIcon={<CheckCircle />} // Ícone para concluído
                                                    />
                                                        <FiDelete className='icon-edit' onClick={() => handleDeleteTasks(task.id)}/>
                                                        <h3>{task.title}</h3>
                                                        <p>{task.description}</p>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        <IoAdd className="add-task-icon" onClick={() => handleAddTask(index)} />
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
                <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
                    <form onSubmit={handleAddColumn}>
                        <h2>Adicionar Nova Coluna</h2>
                        <TextField
                            label="Nome da Coluna"
                            value={column}
                            onChange={(e) => setColumn(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Button type="submit" variant="contained" color="primary">Adicionar</Button>
                    </form>
                </Modal>
                <Modal isOpen={modalTaskOpen} onRequestClose={() => setModalTaskOpen(false)}>
                    <form onSubmit={handleSaveTask}>
                        <h2>Adicionar Nova Tarefa</h2>
                        <TextField
                            label="Título da Tarefa"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Descrição"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <Button type="submit" variant="contained" color="primary">Adicionar</Button>
                    </form>
                </Modal>
            </div>
        </div>
    );
};
