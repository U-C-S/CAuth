import React from 'react'
import './Prompt.css'

import Logos from './Logos'
import ListEntry from './ListEntry'


export default function Prompt() {
    function handleCancel() {
        alert("you clicked calcel")
    }
    function handleAuthorize() {
        alert("you clicked authorize")
    }
    return (
        <div className='Prompt'>
            <Logos />
            <p className='heading'>Authorize YourApp</p>
            <div>
                <ListEntry />
            </div>
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleAuthorize}>Authorize</button>
        </div>
    )
}
