import './App.css';
import { Login } from './components/auth/login/Login'
import { Register } from './components/auth/register/Register'
import { Dashboard } from './components/board/dashboard/Dashboard'

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

function App() {
  return (
      <Router>
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </Router>
  );
}

export default App;
