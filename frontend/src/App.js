import './App.css';
import { Login } from './components/auth/login/Login'
import { Register } from './components/auth/register/Register'
import { User } from './components/auth/user/User';
import { Dashboard } from './components/board/dashboard/Dashboard'
import { Kanban } from './components/board/kanban/Kanban'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

function App() {
  return (
      <Router>
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/user' element={<User/>}/>
          <Route path='/kanban/:id' element={<Kanban/>}/>
          
        </Routes>
      </Router>
  );
}

export default App;
