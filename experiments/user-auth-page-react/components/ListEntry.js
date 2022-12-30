import React from 'react'
import styles from './ListEntry.module.css'

// import logo from './logo.svg'

export default function ListEntry() {
  return (
    <div className={styles.ListEntry}>
      <div className={styles.logoSmol}>
        <img src="" className={styles.imgg}></img>
      </div>
      <div className={styles.text}>
        <p className={styles.headline}>YourApp by YourAppOwner</p>
        <p className={styles.subline}>wants to access your PersonalAppXAccount</p>
      </div>
    </div>
  )
}
