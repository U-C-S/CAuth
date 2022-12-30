import React from 'react'
import styles from './Logos.module.css'

// import logo1 from './logo.svg'

export default function Logos() {
    return (
        <div className={styles.Logos}>
            <div className={styles.logoPack}>
                <div className={styles.logo}>
                    <img src=""></img>
                </div>
                <div className={styles.link}>link</div>
                <div className={styles.logo}>
                    <img src=""></img>
                </div>
            </div>
        </div>
    )
}
