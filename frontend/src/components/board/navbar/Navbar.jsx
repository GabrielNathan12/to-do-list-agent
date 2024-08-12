import "./Navbar.css"
import { FaRegUserCircle } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router-dom'
import { SlHome } from "react-icons/sl";
import { useEffect, useState } from "react";
import { fetchAllUsers, verifyToken } from "../../../services/users/users";

export const Navbar = () => {
    const navigate = useNavigate()
    const [, setUser] = useState(null)
    
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token')
            const email = localStorage.getItem('email')

            if(!token) {
                return navigate('/')
            }

            const isValidToken = await verifyToken(token)
            
            if(!isValidToken){
                localStorage.removeItem('token')
                localStorage.removeItem('email')
                return navigate('/')
            }

            try{
                const response = await fetchAllUsers()
                const filtred = response.data.filter(user => user.email === email)

                if(filtred.length > 0){
                    const currentUser = filtred[0]
                    setUser(currentUser)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchUser()
    }, [navigate])

    const handleLogout = () => {

        try {
            localStorage.removeItem('token')
            localStorage.removeItem('email')
            
            setUser(null)
            setTimeout(() => {
                navigate('/')
            }, 1000)

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="navbar">
            <SlHome className="navbar-icon" onClick={() => navigate('/dashboard')} title="Home"/>
            <FaRegUserCircle className="navbar-icon" onClick={() => navigate('/user')} title="Perfil"/>
            <CiLogout className="navbar-icon" title="Sair" onClick={handleLogout}/>
        </div>
    )
}