import React, { useState } from 'react'
import chat from '../assets/chat.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../main'
import { useDispatch } from 'react-redux'
import { setSelectedUser, setUserData } from '../redux/userSlice'

function Login() {
  const navigate = useNavigate()
  const [show,setShow]=useState(false)
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)
  const [err,setErr] = useState("")
  const dispatch = useDispatch()

  const handleLogin=async(e)=>{
    setLoading(true)
    e.preventDefault()
    try {
        let result = await axios.post(`${serverUrl}/api/auth/login`,{
          email,password
        },{withCredentials:true})
        dispatch(setUserData(result.data))
        dispatch(setSelectedUser(null))
        navigate('/')
        setPassword("")
        setLoading(false)
        setErr("")
    } catch (error) {
        console.log(error)
        setLoading(false)
        setErr(error.response.data.message)
    }
  }

  return (
    <div className='w-full h-[100vh] bg-gray-800 flex items-center justify-center'>
        <div className='w-full max-w-[500px] h-[600px] bg-black rounded-lg shadow-grey-400 shadow-lg
        flex flex-col gap-[10px] p-[10px]'>
            <div className='w-full h-[200px] border-b-4 border-orange-600 flex flex-col items-center justify-center'>
                <div className='flex items-center justify-center'>
                    <img src={chat} alt="chat" className='h-[50px] m-2' />
                    <h1 className='text-white text-[30px] font-bold'>Chaatrr</h1><br />
                </div>               
                <p className='text-orange-600'>Login to your chat!</p>
            </div>
            <form className='w-full flex flex-col gap-[30px] items-center' onSubmit={handleLogin}>
               
                <input type="email" placeholder='emial' className='w-[90%] h-[40px] outline-none border-2
                border-orange-600 px-[20px] py-[10px] rounded-lg' onChange={(e)=>setEmail(e.target.value)}
                value={email}/>
                <div className='w-[90%] h-[40px] relative'>
                    <input type={`${show?"text":"password"}`} 
                    placeholder='password' className='w-full h-full outline-none border-2
                    border-orange-600 px-[20px] py-[10px] rounded-lg' onChange={(e)=>setPassword(e.target.value)}
                    value={password}/>
                    <span className='absolute top-[8px] right-[8px] text-orange-400 font-semibold cursor-pointer
                    ' onClick={()=>setShow(prev=>!prev)}>{`${show?"hide":"show"}`}</span>
                </div>

                {err && <p className='text-red-300 font-semibold'>{err}</p>}

                <button className='w-[200px] h-[40px] bg-orange-600 rounded-lg hover:shadow-orange-400 hover:shadow-lg
                ' disabled={loading}>{loading?"loading...":"Login"}</button>
                <p className='text-white'>Want to create an Account? <span className='text-blue-500 underline 
                cursor-pointer' onClick={()=>navigate('/signup')}>Sign Up</span></p>
            </form>
        </div>
    </div>
  )
}

export default Login