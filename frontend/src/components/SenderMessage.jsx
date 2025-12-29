import React from 'react'
import dp from '../assets/dp.webp'
import { useRef } from 'react'
import { useEffect } from 'react'

function SenderMessage({image,message}) {

  let scroll = useRef()

  useEffect(()=>{
    if(scroll.current){
      scroll?.current.scrollIntoView({behavior:"smooth"})
    }
    },[message,image])

    const handleImageScroll = ()=>{
      scroll?.current.scrollIntoView({behavior:"smooth"})
    }

  return (
    <div className='w-fit max-w-[500px] px-[20px] py-[10px] bg-orange-600 rounded-tr-none rounded-2xl rounded-br-none
    text-white md:text-[20px] text-[15px] relative right-0 ml-auto' ref={scroll}>
      {image &&
      <img src={image} alt="" className='w-[150px]' onLoad={handleImageScroll}/>
      }
      {message &&
        <span>{message}</span>
      }
    </div>
  )
}

export default SenderMessage