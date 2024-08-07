import "./Navbar.css"
import { FaRegUserCircle } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router-dom'
import { SlHome } from "react-icons/sl";

export const Navbar = () => {
    const navigate = useNavigate()

    return (
        <div className="navbar">
            <SlHome className="navbar-icon" onClick={() => navigate('/dashboard')} title="Home"/>
            <FaRegUserCircle className="navbar-icon" onClick={() => navigate('/user')} title="Perfil"/>
            <CiLogout className="navbar-icon" title="Sair"/>
        </div>
    )
}