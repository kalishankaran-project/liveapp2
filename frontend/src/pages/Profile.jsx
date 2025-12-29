import React, { useRef } from 'react'
import dp from '../assets/dp.webp'
import { useDispatch, useSelector } from 'react-redux'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { serverUrl } from '../main';
import axios from 'axios';
import { setUserData } from '../redux/userSlice';

function Profile() {

    let {userData} = useSelector(state=>state.user)
    let navigate = useNavigate()
    let [name,setName] = useState(userData.name || "")
    let [frontendImage,setFrontendImage] = useState(userData.image || dp)
    let [backendImage ,setBackendImage] = useState(null)
    let image = useRef()
    let dispatch = useDispatch()
    let [loading,setLoading] = useState(false)

    const handleImage =(e)=>{
        let file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleProfile = async(e)=>{
        e.preventDefault()
        setLoading(true)
        try {
            let formData = new FormData()
            formData.append("name",name)
            if(backendImage){
                formData.append("image",backendImage)
            }

            let result = await axios.put(`${serverUrl}/api/user/profile`,formData,{withCredentials:true})
            dispatch(setUserData(result.data))
            navigate('/')
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

  return (
        <div className='w-full h-[100vh] bg-gray-800 flex items-center justify-center '>
        <div className='w-full max-w-[500px] h-[600px] bg-black rounded-lg shadow-grey-400 shadow-lg
        flex flex-col justify-center items-center gap-[10px] p-[10px] relative'>
            <IoMdArrowRoundBack  className='w-[30px] h-[30px] absolute text-orange-600 top-[10px] left-[10px]
            cursor-pointer' onClick={()=>navigate('/')}/>
            <div className='w-[150px] h-[150px] rounded-full border-4 border-orange-600 overflow-hidden
            hover:shadow-lg hover:shadow-orange-400 mb-2 flex justify-center items-center' 
            onClick={()=>image.current.click()}>
                <img src={frontendImage} alt={dp} className='h-full w-full'/>
            </div>
            <form className='w-full flex flex-col gap-[30px] items-center' onSubmit={handleProfile}>
                <input type="file" hidden accept='image/*' ref={image} onChange={handleImage}/>
                <input type="text" placeholder='Enter your name' className='w-[90%] h-[40px] outline-none border-2
                border-orange-600 px-[20px] py-[10px] rounded-lg' onChange={(e)=>setName(e.target.value)} value={name}/>
                <input type="text" placeholder='Enter your UserName' className='w-[90%] h-[40px] outline-none border-2
                text-white border-orange-600 px-[20px] py-[10px] rounded-lg' disabled value={userData?.userName}/>
                <p className='font-semibold text-orange-600'>email: <span className='text-gray-400'
                >{userData?.email}</span></p>
                <button className='w-[200px] h-[40px] bg-orange-600 rounded-lg hover:shadow-orange-400 text-white
                hover:shadow-lg' disabled={loading}>{loading?"loading...":"save profile"}</button>
            </form>
        </div>
        </div>

  )
}

export default Profile