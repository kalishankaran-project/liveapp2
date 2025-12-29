import React, { useRef } from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import dp from '../assets/dp.webp'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { BsFillEmojiSmileFill } from "react-icons/bs";
import { FaFileImage } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import axios from 'axios';
import { serverUrl } from '../main';
import { setMessages } from '../redux/messageSlice';
import { useEffect } from 'react';

function MessageArea() {

  const navigate = useNavigate()    
  let {selectedUser,userData,socket} = useSelector(state=>state.user)
  let {messages} = useSelector(state=>state.message)
  let dispatch = useDispatch()
  let [showPicker,setShowPicker] = useState(false)
  let [input,setInput] = useState("")
  let [frontendImage,setFrontendImage] = useState(null)
  let [backendImage,setBackendImage] = useState(null)
  let image = useRef()

  const handleImage=(e)=>{
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleSendMessage = async(e)=>{
    e.preventDefault()
    if(input.length==0 && backendImage==null){
      return
    }
    try {
      let formData = new FormData()
      formData.append("message",input)
      if(backendImage){
        formData.append("image",backendImage)
      }

      let result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`,formData,
        {withCredentials:true})
      dispatch(setMessages([...messages,result.data]))
      setInput("")
      setFrontendImage(null)
      setBackendImage(null)
    } catch (error) {
      console.log(error)
    }
  }
  
  const onEmojiClick=(emojiData)=>{
    setInput(prevInput=>prevInput+emojiData.emoji)
  }

  useEffect(()=>{
    socket.on("newMessage",(mess)=>{
      dispatch(setMessages([...messages,mess]))
    })
    return ()=>{
      socket.off("newMessage")
    }
  },[messages,setMessages])

  return (
    <div className={`lg:w-[70%] ${selectedUser?"flex":"hidden"} w-full h-full bg-black lg:block relative`}>
      {selectedUser &&
      <div className='w-full h-[100vh] flex flex-col overflow-hidden'>
      <div className='w-full h-[100px] border-b-4 border-orange-600 relative flex items-center'>
        <div className='absolute top-[10px] left-[10px]'>
          <IoMdArrowRoundBack  className='w-[30px] h-[30px] text-white
          cursor-pointer' onClick={()=>dispatch(setSelectedUser(null))}/>
        </div>
        <div className='w-[65px] h-[65px] rounded-full border-4 border-orange-600 overflow-hidden
        hover:shadow-lg hover:shadow-orange-400 flex justify-center items-center mt-[20px] ml-[45px]'>
          <img src={selectedUser?.image || dp} alt="" className='h-full w-full'/>
        </div>
        <h1 className='text-gray-100 font-semibold ml-[10px]'>{selectedUser?.name || "user"}</h1>
      </div>

      <div className='w-full h-full flex flex-col pt-[30px] overflow-auto gap-[15px] pb-[120px]'>
        {showPicker && 
        <div className='absolute lg:left-[150px] bottom-[90px] left-[10px] z-50'>
          <EmojiPicker onEmojiClick={onEmojiClick} width={250} height={350}/>
        </div>
        }

        {messages?.map((mess)=>(
         
            mess.sender==userData._id?<SenderMessage image={mess.image} message={mess.message}/>
            :<ReceiverMessage image={mess.image} message={mess.message}/>
          
          
        ))} 

      </div>
      </div>
      }
      {!selectedUser &&
      <div className='w-full h-full flex flex-col justify-center items-center text-orange-600 font-semibold'>
        <h1 className='text-[40px]'>Welcome to Chaatrr!</h1>
        <p className='text-white'>Select a user to start chatting...</p>
      </div>
      }  

      {selectedUser &&
      <div className='w-full lg:w-[70%] h-[100px] fixed bottom-[20px] flex items-center justify-center'>
        {frontendImage && 
        <img src={frontendImage} alt="" className='w-[80px] absolute bottom-[100px] right-[20%] 
        bg-gray-300 p-[10px] rounded-lg'/>
        }
        <form className='w-[95%] lg:max-w-[70%] bg-orange-600 h-[60px] rounded-full flex items-center gap-[15px]'
        onSubmit={handleSendMessage}>
          <div onClick={()=>setShowPicker(prev=>!prev)}>
            <BsFillEmojiSmileFill className='ml-[10px] w-[30px] h-[30px] text-yellow-500 cursor-pointer'/>
          </div>
          <div onClick={()=>image.current.click()}>
            <FaFileImage className='w-[30px] h-[30px] text-green-300 cursor-pointer'/>
          </div>
          <input type="text" className='lg:w-[78%] w-[53%] border-0 outline-none p-[5px] rounded-[5px]'
          placeholder='Message' onChange={(e)=>setInput(e.target.value)} value={input}/>
          <input type="file" accept='image/*' ref={image} hidden onChange={handleImage}/>
          <button>
            <IoSend className='w-[30px] h-[30px] text-blue-300 cursor-pointer'/>
          </button>
        </form>
      </div>  } 
         
    </div>
  )
}

export default MessageArea