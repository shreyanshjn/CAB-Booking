import React from 'react'
import FetchApi from '../../utils/FetchApi'
import AuthService from '../../handlers/AuthService'
import {TextField, FormControl, RadioGroup,FormLabel,Radio, FormControlLabel, Button} from '@material-ui/core'
import  styles from './css/login.module.css'

export default class App extends React.Component {
    constructor()
    {
        super()
        this.state={
            email:'',
            password:'asdfghjkl',
            user: ''
        }
        this.Auth = new AuthService()
    }
    handleChange = (e) => {
        const name = e.target.name
        let value = e.target.value
        this.setState({
            [name]: value
        })
        console.log(value)
    }
    onSubmit = (e) => {
        e.preventDefault()
        let { email, password, user } = this.state
        const data ={ email, password }
        console.log(data)
        if(data)
        {
            FetchApi('post', `/api/${user}/login`, data)
                .then(res=>{
                    if(res && res.data.success===true)
                    {
                        console.log(res.data)
                        console.log('done')
                        this.Auth.setToken('driver',res.data.data.token)
                        this.props.history.push(`/${user}`)
                    }
                })
                .catch(err=>{
                    console.log(err.response,'error')
                    if(err && err.response && err.response.data && err.response.data.message)
                    {
                        this.setState({
                            error: err.response.data.message,
                            show: true
                        })
                    }
                    else {
                        this.setState({
                            error:'Something went wrong',
                            show: true
                        })
                    }
                })
        }
    }
    render()
    {
        let { email, password, user } = this.state
        return (
            <div>
                <form onSubmit={this.onSubmit} className={styles.loginOuterDiv}>
                    <h1>Login</h1>
                    <FormControl component="fieldset" className={styles.formInnerDiv}>
                        <TextField 
                            id="standard-basic" 
                            label="Email" 
                            onChange={this.handleChange}
                            value={email}
                            name="email"
                            required
                        />
                        <TextField 
                            id="standard-basic" 
                            label="Password" 
                            onChange={this.handleChange}
                            value={password}
                            name="password"
                            required
                        />
                        <RadioGroup aria-label="gender" name="user" value={user} onChange={this.handleChange}>
                            <FormControlLabel value="rider" control={<Radio />} label="Rider" />
                            <FormControlLabel value="driver" control={<Radio />} label="Driver" />
                        </RadioGroup>
                    <Button onClick={this.onSubmit} variant="contained" color="primary">
                        Submit
                    </Button>
</FormControl>
            </form>
            </div>
        )
    }
}
