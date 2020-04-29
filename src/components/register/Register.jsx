import React from 'react'
import FetchApi from '../../utils/FetchApi'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import {TextField, FormControl, RadioGroup,FormLabel,Radio, FormControlLabel, Button} from '@material-ui/core'
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
            [name]: value
        })
        console.log(value)
    }
    onSubmit = (e) => {
        e.preventDefault()
        let { name, email, phone, gender, password, user } = this.state
        const data ={ name, email, phone, gender, password }
        console.log(data)
        if(data)
        {
            FetchApi('post', `/api/${user}/register`, data)
                .then(res=>{
                    if(res && res.data.success===true)
                    {
                        console.log('done')
                        this.props.history.push('/login')
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
        console.log(this.props)
        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(this.displayLocationInfo);
        // }
        // const watcher = navigator.geolocation.watchPosition(this.displayLocationInfo);

        // setTimeout(() => {
        //     navigator.geolocation.clearWatch(watcher);
        // }, 15000);
        let { name, email, phone, password, gender, user } = this.state
        return (
            <div>
                {console.log(this.state.latitude,this.state.longitude)}
                {/* <Map center={[29.869370600000003,77.8950389]} zoom={12} touchZoom={false} zoomSnap={0} dragging={false} doubleClickZoom={false} zoomSnap={0} boxZoom={false}> */}

                {/*     <TileLayer attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}

                {/* </Map> */}
                <form onSubmit={this.onSubmit} className={styles.loginOuterDiv}>
                    <h1>Register</h1>
                    <FormControl component="fieldset" className={styles.formInnerDiv}>
                        <TextField 
                            id="standard-basic" 
                            label="name" 
                            onChange={this.handleChange}
                            value={name}
                            name="name"
                            required
                        />
                        <TextField 
                            id="standard-basic" 
                            label="Email" 
                            onChange={this.handleChange}
                            value={email}
                            name="email"
                            required
                        />
                        <RadioGroup aria-label="gender" name="gender" value={gender} onChange={this.handleChange}>
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                        </RadioGroup>
                        <TextField 
                            id="standard-basic" 
                            label="Password" 
                            onChange={this.handleChange}
                            value={password}
                            type="password"
                            name="password"
                            required
                        />
                        <TextField 
                            id="standard-basic" 
                            label="Contact" 
                            onChange={this.handleChange}
                            value={phone}
                            name="phone"
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
