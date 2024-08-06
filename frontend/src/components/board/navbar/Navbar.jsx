import "./Navbar.css"
import { FaRegUserCircle } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router-dom'

export const Navbar = () => {
    const navigate = useNavigate()

    return (
        <div className="navbar">
            <FaRegUserCircle className="navbar-icon" onClick={() => navigate('/user')} title="Perfil"/>
            <CiLogout className="navbar-icon"/>
        </div>
    )
}