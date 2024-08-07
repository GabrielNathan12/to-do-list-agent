import "./Login.css"
import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Alert, IconButton, InputAdornment } from '@mui/material';
import { FaRegUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../../../services/users/users";

export const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        try{
            const response = await login(email, password)
            setSuccessMessage('Seja bem vindo')
            setErrorMessage('')

            const token = response.data.token

            localStorage.setItem('token', token)
            localStorage.setItem('email', email)
            
            setTimeout(() => {
                navigate('/dashboard')
            }, 2000)

        }catch(error){  
            setErrorMessage('Falha ao realizar o seu Login, por favor check suas credenciais')
            setSuccessMessage('')
        }
    }
    return (
        <div className="container-login">
            <form onSubmit={handleSubmit}>
                <div className="user-icon">
                    <FaRegUserCircle/>
                </div>
                <div className="alert-container">
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                </div>
                <div className="input-field">
                    <TextField label="E-mail" variant="filled" type='email' required onChange={(e) => setEmail(e.target.value)} InputProps={{
                        disableUnderline: true,
                        sx: {fontSize: '20px'}
                    }} fullWidth />
                </div>
                <div className='input-field'>
                    <TextField label="Senha" variant="filled" type={showPassword ? 'text' : 'password'} required onChange={(e) => setPassword(e.target.value)} InputProps={{
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
                    }} fullWidth/>
                </div>
                <Button type="submit">Login</Button>
                <div className="password-forget">
                    <a href="#">Esqueceu sua senha ?</a>
                </div>
                <div className="register-link">
                    <Link to={'/register'}>Cadastro</Link>
                </div>
            </form>
        </div>
    )
}