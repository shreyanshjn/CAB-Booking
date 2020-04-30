import React from 'react'
import FetchApi from '../../utils/FetchApi'
import {TextField, FormControl, RadioGroup,Radio, FormControlLabel, Button} from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab';
import styles from './css/register.module.css'

export default class Register extends React.Component {
    constructor()
    {
        super()
        this.state={
            name:'sfa',
            email:'fasdfa@kf.com',
            phone:'349123849',
            gender:'',
            password:'asdfghjkl',
            user:'',
            latitude:'',
            longitude:'',
            error: ''
        }
    }
    displayLocationInfo = (position) => {
        this.setState({
            latitude: position.coords.longitude,
            longitude: position.coords.latitude
        })
    }
    handleChange = (e) => {
        console.log(e.target.name)
        const name = e.target.name
        let value = e.target.value
        console.log(name)
        this.setState({
            [name]: value,
            error: ''
        })
        console.log(value)
    }
    onSubmit = async (e) => {
        e.preventDefault()
        let { name, email, phone, gender, password, user } = this.state
        const data ={ name, email, phone, gender, password }
        console.log(data)
        console.log(user)
        if(data && user)
        {
            await FetchApi('post', `/api/${user}/register`, data)
                .then(res=>{
                    if(res && res.data.success===true)
                    {
                        this.props.history.push('/login')
                    }
                })
                .catch(err=>{
                    console.log(err.response)
                    if(err && err.response && err.response.data && err.response.data.msg)
                    {
                        this.setState({
                            error: err.response.data.msg,
                        })
                    }
                    else {
                        this.setState({
                            error:'Something went wrong',
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
        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(this.displayLocationInfo);
        // }
        // const watcher = navigator.geolocation.watchPosition(this.displayLocationInfo);

        // setTimeout(() => {
        //     navigator.geolocation.clearWatch(watcher);
        // }, 15000);
        let { name, email, phone, password, gender, user, error } = this.state
        return (
            <div>
                {error ? <Alert severity="error" className={styles.alertDiv}>
                    <AlertTitle>Error</AlertTitle>
                     <strong>{error}</strong>
                </Alert>: null}
                {/* <Map center={[29.869370600000003,77.8950389]} zoom={12} touchZoom={false} zoomSnap={0} dragging={false} doubleClickZoom={false} zoomSnap={0} boxZoom={false}> */}

                {/*     <TileLayer attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}

                {/* </Map> */}
                <form onSubmit={this.onSubmit} className={styles.loginOuterDiv}>
                    <h1>Register</h1>
                    <FormControl component="fieldset" className={styles.formInnerDiv}>
                        <TextField
                            name="name"
                            onChange={this.handleChange}
                            value={name}
                            id="filled-required"
                            label="Name"
                            variant="outlined"
                            required
                        />
                        <br />
                        <TextField
                            name="email"
                            onChange={this.handleChange}
                            value={email}
                            id="filled-required"
                            label="Email"
                            variant="outlined"
                            required
                        />
                        <br />
                        <TextField
                            name="password"
                            onChange={this.handleChange}
                            value={password}
                            id="filled-required"
                            label="Password"
                            variant="outlined"
                            type="password"
                            required
                        />
                        <br />
                        <RadioGroup aria-label="gender" name="gender" value={gender} onChange={this.handleChange}>
                            <FormControlLabel 
                                value="male"
                                control={<Radio />} 
                                label="Male"
                                required
                            />
                            <FormControlLabel
                                value="female"
                                control={<Radio />}
                                label="Female"
                                required
                            />
                        </RadioGroup>
                        <br />
                        <TextField 
                            id="standard-basic" 
                            label="Contact" 
                            onChange={this.handleChange}
                            value={phone}
                            name="phone"
                            required
                        />
                        <br />
                        <RadioGroup aria-label="user" name="user" value={user} onChange={this.handleChange}>
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
                            Submit
                        </Button>
                    </FormControl>
                </form>
            </div>
        )
    }
}
