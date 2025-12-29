import React from 'react'
import dp from '../assets/dp.webp'
import { useEffect } from 'react'
import { useRef } from 'react'

function ReceiverMessage({image,message}) {

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
    <div className='w-fit max-w-[500px] px-[20px] py-[10px] bg-yellow-600 rounded-tl-none rounded-2xl rounded-bl-none
    text-white md:text-[20px] text-[15px] relative left-0 mr-auto' ref={scroll}>
      {image &&
      <img src={image} alt="" className='w-[150px]' onLoad={handleImageScroll}/>
      }
      {message &&
        <span>{message}</span>
      }
    </div>
  )
}

export default ReceiverMessage