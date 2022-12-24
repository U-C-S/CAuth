import React from 'react'
import './Logos.css'

import logo1 from './logo.svg'

export default function Logos() {
    return (
        <div className='Logos'>
            <div className='logo-pack'>
                <div className='logo'>
                    <img src={logo1}></img>
                </div>
                <div className='link'>link</div>
                <div className='logo'>
                    <img src={logo1}></img>
                </div>
            </div>
        </div>
    )
}
