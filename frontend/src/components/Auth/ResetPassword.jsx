import React, { useState } from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import { handleError, handleSuccess } from '../../utils';
import './Login.css';

function ResetPassword(){
  const[password,setPassword]=useState('');

  const navigate=useNavigate();

  const {id,token} =useParams();

  const handleSubmit=async(e)=>{
    e.preventDefault();

    try {
      const url=`http://localhost:5000/reset-password/newpass/${id}/${token}`;
      const response=await fetch(url,{
        method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({password})
      });

      const data=await response.json();
      if(response.ok) 
       { handleSuccess(data.message);

        setTimeout(() => {
          navigate('/login');
        }, 2000);
       }

      else{
        handleError(data.message||'Something went wrong');
      }
    
    } catch (err) {
      handleError("Something went wrong.Please try again later.");
    }
  }
 


  return(
    <div className='container'>
    <h1>Reset Password</h1>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='Password'>New Password</label>
        <input
           type='password'
           name='password'
           placeholder='Enter your new password....'
           value={password}
           onChange={(e)=>setPassword(e.target.value)}
        />
      </div>

      <button type='Submit' disabled={!password}>Update</button>
      </form>
      <ToastContainer />
      </div>
  )
  
}

export default ResetPassword;