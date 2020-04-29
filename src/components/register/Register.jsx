import React from 'react'
import FetchApi from '../../utils/FetchApi'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import './css/Register.css'

export default class Register extends React.Component {
    constructor()
    {
        super()
        this.state={
            name:'sfa',
            email:'fasdfa@kf.com',
            contact:'349123849',
            gender:'',
            password:'asdfghjkl',
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
        let { name, email, contact, gender, password } = this.state
        const data ={ name, email, contact, gender, password }
        console.log(data)
        if(data)
        {
            FetchApi('post', '/api/driver/register', data)
                .then(res=>{
                    if(res && res.data.success===true)
                    {
                        console.log('done')
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
        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(this.displayLocationInfo);
        // }
        // const watcher = navigator.geolocation.watchPosition(this.displayLocationInfo);

        // setTimeout(() => {
        //     navigator.geolocation.clearWatch(watcher);
        // }, 15000);
        let { name, email, contact, password, gender } = this.state
        return (
            <div>
                {console.log(this.state.latitude,this.state.longitude)}
                <Map center={[29.869370600000003,77.8950389]} zoom={12} touchZoom={false} zoomSnap={0} dragging={false} doubleClickZoom={false} zoomSnap={0} boxZoom={false}>

                    <TileLayer attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                </Map>
                <form onSubmit={this.onSubmit}>
                    Name
                    <input
                        type="text" 
                        placeholder="Your Name"
                        name="name"
                        value={name}
                        onChange={this.handleChange}
                        required
                    />
                    Email
                    <input
                        type="text" 
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={this.handleChange}
                        required
                    />
                    Password
                    <input
                        type="password" 
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={this.handleChange}
                        required
                    />
                    Male
                    <input
                        type="radio" 
                        name="gender"
                        value="male"
                        onChange={this.handleChange}
                        required
                    />
                    Female
                    <input
                        type="radio" 
                        name="gender"
                        value="female"
                        onChange={this.handleChange}
                        required
                    />
                    <button>Submit</button>
            </form>
            </div>
        )
    }
}
