import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@material-ui/core'
import styles from './css/Home.module.css'
import taxi from './img/taxi.png'

export default class Home extends React.Component {
    render()
    {
        return (
            <div className={styles.homeOuterDiv}>
                <div className={styles.firstDiv}>
                    <div className={styles.logo}>
                        <h3>
                            CAB BOOK
                        </h3>
                    </div>
                    <div className={styles.buttonsDiv}>
                        {!this.props.isAuthenticated ? 
                        <React.Fragment> <Link to="/register">
                            <Button className={styles.buttons} variant="contained">Register</Button>
                        </Link>
                        <Link to="/login">
                            <Button className={styles.buttons} variant="contained">Login</Button>
                        </Link></React.Fragment>:
                        <Link to={this.props.user}>
                            <Button className={styles.buttons} variant="contained">Dashboard</Button>
                        </Link>}
                    </div>
                </div>
                <hr  className={styles.horizontal}/>
                <div className={styles.taxi}>
                    <img src={taxi} alt="taxi"/>
                </div>
                <div>
                    <div>
                        <h1 className={styles.heading}>
                            THE BEST CAB BOOKING WEBSITE
                        </h1>
                    </div>
                </div>
            </div>
        )
    }
}
