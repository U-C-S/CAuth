import React from 'react'
import styles from './Logos.module.css'

// import logo1 from './logo.svg'

export default function Logos(props) {
    return (
        <div className={styles.Logos}>
            <div className={styles.logoPack}>
                <div className={styles.logo}>
                    <img src={props.appLogo}></img>
                </div>
                <div className={styles.link}></div>
                <div className={styles.logo}>
                    <img src={props.accountLogo}></img>
                </div>
            </div>
        </div>
    )
}
