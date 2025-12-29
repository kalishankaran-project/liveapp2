import React from 'react'
import SideBar from '../components/SideBar'
import MessageArea from '../components/MessageArea'
import getMessage from '../customHooks/getMessages'

function Home() {

  getMessage()

  return (
    <div className='w-full h-[100vh] flex'>
      <SideBar/>
      <MessageArea/>
    </div>
  )
}

export default Home