import React from 'react'
import FetchApi from '../../utils/FetchApi'
import AuthService from '../../handlers/AuthService'
import {TextField, FormControl, RadioGroup ,Radio, FormControlLabel, Button} from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab';
import  styles from './css/login.module.css'
import lock from './img/lock.jpg'

export default class App extends React.Component {
    constructor()
    {
        super()
        this.state={
            email:'',
            password:'',
            user: '',
            error: ''
        }
        this.Auth = new AuthService()
    }
    handleChange = (e) => {
        const name = e.target.name
        let value = e.target.value
        this.setState({
            [name]: value,
            error: ''
        })
    }
    onSubmit = async (e) => {
        e.preventDefault()
        let { email, password, user } = this.state
        const data ={ email, password }
        if(data && data.email && data.password && user)
        {
                 await FetchApi('post', `/api/${user}/login`, data)
                .then(res=> {
                    if(res && res.data)
                    {
                        this.Auth.setToken(`${user}`,res.data.token)
                        this.props.history.push(`${user}`)
                        this.props.updateAuthentication(true,user)
                    }
                })
                .catch(err => {
                    if(err.response && err.response.data && err.response.data.msg)
                    {
                        this.setState({
                            error: err.response.data.msg
                        })
                    }
                    else
                    {
                        this.setState({
                            error: 'Something went wrong'
                        })
                    }
                })
        }
        else
        {
            this.setState({
                error: 'All fields are required'
            })
        }
    }
    render()
    {
        let { email, password, user,error } = this.state
        return (
            <div className={styles.outerDiv}>
                {error ? <Alert severity="error" className={styles.alertDiv}>
                    <AlertTitle>Error</AlertTitle>
                     <strong>{error}</strong>
                </Alert>: null}
                <form onSubmit={this.onSubmit} className={styles.loginOuterDiv}>
                    <img src={lock} className={styles.lock} alt="sign in"/>
                    <h1>Sign In</h1>
                    <FormControl component="fieldset" className={styles.formInnerDiv}>
                        <TextField
                            name="email"
                            onChange={this.handleChange}
                            value={email}
                            id="filled-required"
                            label="Email"
                            variant="outlined"
                            required
                        />
                        <br/>
                        <br/>
                        <TextField
                            id="filled-required"
                            label="Password"
                            variant="outlined"
                            type="password"
                            onChange={this.handleChange}
                            value={password}
                            name="password"
                            required
                        />
                        <br/>
                        <br/>
                        <RadioGroup aria-label="gender" name="user" value={user} onChange={this.handleChange}>
                            <FormControlLabel 
                                value="rider"
                                control={<Radio />}
                                label="Rider" 
                                required
                            />
                            <FormControlLabel 
                                value="driver"
                                control={<Radio />}
                                label="Driver" 
                                required
                            />
                        </RadioGroup>
                        <br />
                    <Button onClick={this.onSubmit} variant="outlined" color="primary">
                        Log In
                    </Button>
</FormControl>
            </form>
            </div>
        )
    }
}
