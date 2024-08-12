import "./User.css"
import React, { useEffect, useState } from 'react';
import { Navbar } from "../../board/navbar/Navbar"
import { TextField, Button, Alert, IconButton, InputAdornment, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { FaRegUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { deleteUser, fetchAllUsers, updateUser, verifyToken } from "../../../services/users/users";


export const User = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token')
            const email = localStorage.getItem('email')

            if(!token){
                return navigate('/')
            }
            const isValidToken = await verifyToken(token)

            if(!isValidToken){
                localStorage.removeItem('token')
                localStorage.removeItem('email')
                return navigate('/')
            }

            try {
                const response = await fetchAllUsers()
                const filtred = response.data.filter(user => user.email === email)
                
                if(filtred.length > 0){
                    const currentUser = filtred[0]
                    setUser(currentUser)
                    setName(currentUser.name)
                    setEmail(currentUser.email)
                }
            } catch (error) {
                setErrorMessage("Não foi possível atualizar os dados");
                setSuccessMessage("")
            }
        }
        fetchUser()
    }, [navigate])

    const handleSubmit = async (event) => {
        event.preventDefault()

        if(password !== confirmPassword){
            setErrorMessage("As suas senhas não conferem")
            return
        }
        if (password.length < 8){
            setErrorMessage("Sua senha é muito curta")
            return
        }

        try{
            await updateUser(user._id, name, email, password)

            setSuccessMessage("Dados atualizados com sucesso")
            setErrorMessage("")
            console.log(user.id)
            setTimeout(() => {
                navigate("/dashboard")
            }, 2000)
        }
        catch(error){
            setErrorMessage("Esse e-mail já está em uso")
            setSuccessMessage("")
        }
    }
    const handleDeleteUser = async () => {
        try {
            await deleteUser(user._id)
            setSuccessMessage("Conta deletada com sucesso")
            setErrorMessage("")
            localStorage.removeItem('token')
            localStorage.removeItem('email')
            
            setTimeout(() => {
                navigate('/')
            }, 1000)

        } catch (error) {
            setErrorMessage("Não foi possível deletar a sua conta")
            setSuccessMessage("")
            setTimeout(() =>{
                setErrorMessage("")
            }, 2000)
        }
    }

    return (
        <div className="user-container">
            <Navbar/>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="user-icon">
                        <FaRegUserCircle/>
                    </div>
                    <h1>Edição de perfil</h1>
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}
                    {errorMessage && <Alert security="error">{errorMessage}</Alert>}
                    
                    <div className="input-field">
                        <TextField label="Seu nome" variant="filled" type="text" value={name} required onChange={(e) => setName(e.target.value)}
                            InputProps={{
                                disableUnderline: true
                            }} fullWidth
                        />
                    </div>
                    <div className="input-field">
                        <TextField label="E-mail" variant="filled" type="email" value={email} required onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                disableUnderline: true
                            }} fullWidth
                        />
                    </div>
                    <div className="input-field">
                        <TextField label="Senha" variant="filled" type={showPassword ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                disableUnderline: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <FaEyeSlash className="icon-password" /> : <FaEye className="icon-password" />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }} fullWidth
                        />
                    </div>
                    <div className="input-field">
                        <TextField label="Confirme sua Senha" variant="filled" type={showConfirmPassword ? 'text' : 'password'} onChange={(e) => setConfirmPassword(e.target.value)}
                            InputProps={{
                                disableUnderline: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                            {showConfirmPassword ? <FaEyeSlash className="icon-password" /> : <FaEye className="icon-password" />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }} fullWidth
                        />
                    </div>
                    <Button type="submit">Atualizar Dados</Button>
                    <Button className="button-delete" color="error" onClick={() => setConfirmDeleteOpen(true)}>Deletar Conta</Button>
                </form>
            </div>
            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Confirmação de Exclusão"}
                </DialogTitle>
                <DialogContent>
                    <p>Tem certeza de que deseja excluir a sua conta? Esta ação não pode ser desfeita.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)}>Cancelar</Button>
                    <Button color="error" onClick={handleDeleteUser} autoFocus>
                        Deletar Conta
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}