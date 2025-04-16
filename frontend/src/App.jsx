import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Navigate,Routes,Route} from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Home from './components/home/Home';
import RefreshHandler from './RefreshHandler';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';


function App() {
  const[IsAuthenticated,setIsAuthenticated]=useState(false);

  const PrivateRoute=({element})=>{
    return IsAuthenticated ? element : <Navigate to='/login' />
  }

  return (
     <div className='App'>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgot-password' element={< ForgotPassword />} />
        <Route path='/reset-password/:id/:token' element={<ResetPassword />} />
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
      </Routes>
     </div>
  )
};

export default App;