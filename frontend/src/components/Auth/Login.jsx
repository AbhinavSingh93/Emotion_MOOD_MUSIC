import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import { handleError, handleSuccess } from '../../utils';
import './Login.css';

function Login(){
  
  const [ LoginInfo, setLoginInfo ]=useState({
    email:'',
    password:''
  })
  
  const navigate=useNavigate();

  const handleChange=(e)=>{
    const {name,value} =e.target;
    console.log(name,value);
    const copyLoginInfo ={ ...LoginInfo };
    copyLoginInfo[name]=value;
    setLoginInfo(copyLoginInfo);
  }

 const handleLogin=async(e)=>{
  e.preventDefault();
  const {email,password}=LoginInfo;
  if(!email || !password)
  {
    return handleError('email and password required');
  }
  try {
    const url="https://emotion-mood-music.onrender.com/auth/Login";
    const response =await fetch(url,{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(LoginInfo)
    });
    const result=await response.json();
    const {success,message,jwtToken,name,error}=result;
    if(success){
      handleSuccess(message);
      localStorage.setItem('token',jwtToken);
      localStorage.setItem('loggedInUser',name);
      setTimeout(()=>{
           navigate('/home')
      },1000)
    }else if(error)
    {
      const details =error?.details[0].message;
      handleError(details);
    }else if(!success)
    {
      handleError(message);
    }
    console.log(result);
  } catch (err) {
    handleError(err);
  }
 }

  return(
    <div className='container'>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor='email'>Email</label>
            <input
               onChange={handleChange}
               type='email'
               name='email'
               placeholder='Enter your email....'
               value={LoginInfo.email}
            />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input
               onChange={handleChange}
               type='password'
               name='password'
               placeholder='Enter your password....'
               value={LoginInfo.password}
            />
          </div>
          <button type='Submit'>Login</button>
          <span>Don't have an account ?
            <Link to='/signup'>Signup</Link>
          </span>
          <span>Forgot password ?
            <Link to='/forgot-password'>Click Here</Link>
          </span>
        </form>
        <ToastContainer />
    </div>
  )
}

export default Login;