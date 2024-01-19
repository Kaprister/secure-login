import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className=' h-[100vh] w-full flex flex-col justify-center items-center gap-5 text-white bg-red-600'>
      <Link to='/home' className=' font-extrabold text-xl sm:text-3xl drop-shadow-2xl'>Enhance Security Alerts</Link>
      <h1 className='font-extrabold text-2xl sm:text-4xl text-gray-800 text-shadow-xl'>WELCOME TO HOME PAGE</h1>
      <div className=' flex gap-5'>
        <Link to='/' className=' bg-green-500  rounded-md py-2 px-4 text-white font-bold hover:bg-green-400 w-full text-center'>Login</Link>
        <Link to='/signup' className=' bg-green-500  rounded-md py-2 px-3 text-white font-bold hover:bg-green-400 w-full text-center'>signup</Link>
      </div>
    </div>
  )
}

export default Home
