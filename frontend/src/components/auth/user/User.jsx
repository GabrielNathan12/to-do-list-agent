import "./User.css"
import React, { useState } from 'react';
import { Navbar } from "../../board/navbar/Navbar"
import { TextField, Button, Alert, IconButton, InputAdornment } from '@mui/material';
import { FaRegUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';


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
            setSuccessMessage("Cadastro realizado com sucesso")
            setErrorMessage("")

            setTimeout(() => {
                navigate("/")
            }, 2000)
        }
        catch(error){
            setErrorMessage("Esse e-mail já está em uso")
            setSuccessMessage("")
        }
    }
    return (
        <div className="user">
            <Navbar/>
            <form onSubmit={handleSubmit}>
                <div className="user-icon">
                    <FaRegUserCircle/>
                </div>
                <div className="alert-container">
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                </div>
                <div className='input-field'>
                    <TextField label="Nome" variant="filled" type='text' required  onChange={(e) => setName(e.target.value)} 
                        InputProps={{
                            disableUnderline: true,
                            sx: {fontSize: '20px'}
                        }} fullWidth
                    />
                </div>
                <div className='input-field'>
                    <TextField label="E-mail" variant="filled" type='email' required onChange={(e) => setEmail(e.target.value)} 
                        InputProps={{
                            disableUnderline: true,
                            sx: {fontSize: '20px'}
                        }} fullWidth
                    />
                </div>
                <div className='input-field'>
                    <TextField label="Senha" variant="filled" type={showPassword ? 'text' : 'password'} required 
                        onChange={(e) => setPassword(e.target.value)} 
                        InputProps={{
                            disableUnderline: true,
                            sx: {fontSize: '20px'},
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        edge="end"
                                    >
                                        {showPassword ? <FaEyeSlash className='icon-password'/> : <FaEye className='icon-password'/>}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }} fullWidth
                    />
                </div>
                <div className='input-field'>
                    <TextField label="Confirme sua senha" variant="filled" type={showConfirmPassword ? 'text' : 'password'} required 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        InputProps={{
                            disableUnderline: true,
                            sx: {fontSize: '20px'},
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton 
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash className='icon-password'/> : <FaEye className='icon-password'/>}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }} fullWidth
                    />
                </div>
                <Button type="submit">Cadastrar</Button>
                <div className='signup-link'>
                    <Link to={'/'}> Voltar a página de Login </Link>
                </div>
            </form>
        </div>
    )
}