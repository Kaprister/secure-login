import React, { useState } from 'react'
// import Validation from './SignupValidation';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const Signup = () => {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const navigate = useNavigate();

    const inputHandler = (event) => {
        setValues(prev => ({...prev, [event.target.name] : event.target.value}))
    }

    const submitHandler = (event) => {
        event.preventDefault();


        axios.post('https://secure-login-backend.onrender.com/api/v1/auth/signup', values)
            .then(res => {
                if(res.status === 200){
                    navigate('/')
                    alert('User registered successfully!')
                }else{
                    alert("something went wrong, please try again!")
                }
            })
            .catch((error) => {
                if (error.response) {
                    const statusCode = error.response.status;
        
                    if (statusCode === 403) {
                        alert("All fields are required!");
                    } else if (statusCode === 401) {
                        alert("Password and Confirm Password do not match!");
                    } else if (statusCode === 400) {
                        alert("User already exists. Please log in to continue!");
                    } else if (statusCode === 500) {
                        alert("User cannot be registered. Please try again!");
                    } else {
                        alert(`Unexpected error with status code ${statusCode}. Please try again!`);
                    }
                } else {
                    console.error(error);
                    alert("Something went wrong. Please try again!");
                }
            });

    }



  return (
    <div className='flex flex-col gap-3 justify-center items-center bg-red-600 h-[100vh]'>
      <Link to='/signup' className=' font-extrabold text-3xl drop-shadow-2xl'>Enhance Security Alerts</Link>
      <div className='bg-white p-3 rounded m-2'>
      <h2 className=' font-extrabold text-sky-500'>Sign-Up</h2>
        <form action='' onSubmit={submitHandler}>
            <div className='mb-3'>
                <label htmlFor='name'><strong>Name</strong></label>
                <input type='text' 
                placeholder='Enter Name' 
                name = 'name'
                onChange={inputHandler}
                className='w-full rounded-md border border-solid border-gray-100 text-center outline-none bg-slate-100'/>
            </div>
            <div className='mb-3'>
                <label htmlFor='email'><strong>Email</strong></label>
                <input type='email' placeholder='Enter Email'
                 name='email'
                onChange={inputHandler}
                 className='w-full rounded-md border border-solid border-gray-100 text-center outline-none bg-slate-100'/>
            </div>
            <div className='mb-3'>
                <label htmlFor='password'><strong>Password</strong></label>
                <input type='password' 
                placeholder='Enter Password' 
                name='password'
                onChange={inputHandler}
                className='w-full rounded-md border border-solid border-gray-100 text-center outline-none bg-slate-100'/>
            </div>
            <div className='mb-3'>
                <label htmlFor='confirmPassword'><strong>Confirm Password</strong></label>
                <input type='password' 
                placeholder='confirm Password' 
                name='confirmPassword'
                onChange={inputHandler}
                className='w-full rounded-md border border-solid border-gray-100 text-center outline-none bg-slate-100'/>
            </div>
            <button type='submit' className="bg-orange-500 hover:bg-orange-400 text-white w-full rounded-md py-2 "><strong>Sign up</strong></button>
            <p className=' pb-2 italic'> You are agree to our terms and policies</p>
            <div className=' w-full flex justify-center items-center'>
                <Link to="/" className='border bg-green-500  rounded-md py-2 px-2 text-white font-bold hover:bg-green-400 w-full text-center'>Log in</Link>
            </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
