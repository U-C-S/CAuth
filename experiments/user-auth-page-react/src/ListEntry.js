import React from 'react'
import './ListEntry.css'

import logo from './logo.svg'

export default function ListEntry() {
  return (
    <div className='ListEntry'>
      <div className='logo-smol'>
        <img src={logo}></img>
      </div>
      <div className='text'>
        <p className='headline'>YourApp by YourAppOwner</p>
        <p className='subline'>wants to access your PersonalAppXAccount</p>
      </div>
    </div>
  )
}
