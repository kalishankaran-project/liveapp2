import React, { useEffect, useRef, useState } from 'react'
import chat from '../assets/chat.png'
import { useDispatch, useSelector } from 'react-redux'
import { IoSearch } from "react-icons/io5";
import dp from '../assets/dp.webp'
import { IoMenu } from "react-icons/io5";
import axios from 'axios'
import { serverUrl } from '../main';
import { setOtherUsers, setSearchData, setSelectedUser, setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function SideBar() {

    let {userData,otherUsers,onlineUsers,searchData} = useSelector(state=>state.user)
    let [menu,setMenu] = useState(false)
    let dispatch = useDispatch()
    let navigate = useNavigate()
    let menuRef = useRef(null)
    let {selectedUser} = useSelector(state=>state.user)
    let [input,setInput] = useState("")

    useEffect(()=>{
        if(!menu) return;
        
        const handler = (e)=>{
            if(menuRef.current?.contains(e.target)){
                return;
            }
            setMenu(false);
        }
        document.addEventListener("pointerdown",handler,{once:true})
        return ()=>{
            document.removeEventListener("pointerdown",handler)
        }
    },[menu])

    const handleLogOut=async()=>{
        try {
            let result= await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
            dispatch(setUserData(null))
            dispatch(setOtherUsers(null))
            navigate('/login')
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearch=async()=>{
        try {
            let result= await axios.get(`${serverUrl}/api/user/search?query=${input}`,{withCredentials:true})
            dispatch(setSearchData(result.data))
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        if(input){
            handleSearch()
        }
    },[input])

  return (
    <div className={`lg:w-[30%] lg:block w-full h-full bg-gray-800 ${!selectedUser?"block":"hidden"}`}>
        <div className='w-full h-[200px] flex items-center justify-center border-b-4 pb-4 border-orange-600 relative
         mb-[10px]'>
            <img src={chat} alt="chat" className='h-[50px] mr-2' />
            <h1 className='text-white text-[30px] font-bold'>Chaatrr</h1><br />
            <div className='md:w-[400px] w-[320px] h-[60px] rounded-full absolute bottom-[10px] left-[20px] 
            bg-orange-600 flex items-center p-2'>
                <IoSearch className='text-white w-[25px] h-[25px] hover:scale-125'/>
                <form className='w-[280px] md:w-full h-[40px] bg-gray-300 rounded-full overflow-hidden'>
                    <input type="text" placeholder='search user outline-none' className='w-full h-full p-2
                    focus:outline-none'
                    onChange={(e)=>setInput(e.target.value)} value={input}/>
                </form>
            </div>
            {!menu &&
            <div className='absolute top-[20px] right-[20px] text-orange-600 w-[40px] h-[40px] cursor-pointer'>
                <IoMenu className='w-full h-full' onClick={()=>setMenu(true)}/>
            </div>
            }
            {menu &&
            <div className='absolute top-[20px] right-[20px] w-[150px] h-[100px] bg-gray-400 text-white rounded-2xl'
            ref={menuRef}>
                <h1 className='mt-[10px] ml-[10px] cursor-pointer' onClick={()=>navigate('/profile')}>
                    profile</h1><br />
                <h1 className='ml-[10px] cursor-pointer z-50' onClick={handleLogOut}>logout</h1>
            </div>
            }
        </div>
        {!input?
        <div className='w-full flex flex-col'>
            {otherUsers?.map((user)=>(
                <div className='w-full h-[70px] mt-[2px] mb-[5px] ml-2 border-b-2 border-orange-600 flex items-center
                hover:bg-gray-300 cursor-pointer relative' onClick={()=>dispatch(setSelectedUser(user))}>
                <div className='w-[65px] h-[65px] rounded-full border-4 border-orange-600 overflow-hidden
                hover:shadow-lg hover:shadow-orange-400 flex justify-center items-center'>
                    <img src={user.image || dp} alt="" className='h-full w-full'/>
                </div>
                {onlineUsers?.includes(user._id) &&
                <div className='w-[15px] h-[15px] rounded-full bg-green-500 bottom-[5px] absolute'></div>
                }
                <div className='h-[20px] text-white font-semibold ml-[10px]'>{user.name || user.userName}</div>
                </div>
            ))}
        </div>
        :
        <div className='w-full flex flex-col'>
            {searchData?.filter(user=>user._id !== userData._id).map((user)=>(
                <div className='w-full h-[70px] mt-[2px] mb-[5px] ml-2 border-b-2 border-orange-600 flex items-center
                hover:bg-gray-300 cursor-pointer relative' onClick={()=>dispatch(setSelectedUser(user))}>
                <div className='w-[65px] h-[65px] rounded-full border-4 border-orange-600 overflow-hidden
                hover:shadow-lg hover:shadow-orange-400 flex justify-center items-center'>
                    <img src={user.image || dp} alt="" className='h-full w-full'/>
                </div>
                {onlineUsers?.includes(user._id) &&
                <div className='w-[15px] h-[15px] rounded-full bg-green-500 bottom-[5px] absolute'></div>
                }
                <div className='h-[20px] text-white font-semibold ml-[10px]'>{user.name || user.userName}</div>
                </div>
            ))}
        </div> 
        }

    </div>
  )
}

export default SideBar