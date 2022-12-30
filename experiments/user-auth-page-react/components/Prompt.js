import React from 'react'
import styles from './Prompt.module.css'

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
        <div className={styles.Prompt}>
            <Logos />
            <p className={styles.heading}>Authorize YourApp</p>
            <div>
                <ListEntry />
            </div>
            <div className={styles.buttons}>
                <button className={styles.button} onClick={handleCancel}>Cancel</button>
                <button className={styles.button} onClick={handleAuthorize}>Authorize</button>
            </div>
        </div>
    )
}
