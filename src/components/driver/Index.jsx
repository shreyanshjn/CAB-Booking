import React from 'react'
import { Link } from 'react-router-dom'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { Icon } from 'leaflet'
import FetchApi from '../../utils/FetchApi'
import AuthService from '../../handlers/AuthService'
import { Button } from '@material-ui/core'
import Logout from '../logout/Logout'
import styles from './css/driver.module.css'

var carIcon = new Icon({
    iconUrl: '/car.svg',
    iconSize: [50,50]
})
export default class Driver extends React.Component
{
    constructor()
    {
        super()
        this.state = {
            latitude: '',
            longitude: '',
            activeRides: '',
            active: false
        }
        this.Auth = new AuthService()
    }
    componentDidMount() {
        this.getLocation()
        this.refreshInterval = setInterval(this.updateLocation, 10000);
        this.showRidesInterval= setInterval(this.showActiveRides, 10000);
    }
    showActiveRides = async () => {
        let token = this.Auth.getToken('driver')
        if(token)
        {
            await FetchApi('get','/api/booking/confirmRide',null,token)
                .then(res => {
                    console.log(res.data)
                    if(res && res.data)
                    {
                        this.setState({
                            activeRides: res.data.data
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    acceptRide = async (ride) => {
        console.log(ride)
        const token = this.Auth.getToken('driver')
        if(token)
        {
            const _id = ride._id
            const data = { _id }
            // console.log(data)
            await FetchApi('post','/api/booking/driverConfirmation',data,token)
                .then(res => {
                    console.log(res.data)
                    clearInterval(this.showRidesInterval)
                    this.props.history.push(`/driver/${res.data.data.driverId}`)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
    getLocation = () => {
        if (navigator.geolocation) {
            // navigator.geolocation.getCurrentPosition(this.getCoordinates,this.handleErrors)
            this.watchId = navigator.geolocation.watchPosition(this.getCoordinates)
        } else {
            alert("Geolocation is not supported by this browser.")
        }
    }
    getCoordinates = (position) => {
        this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }
    handleErrors = (error) => {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.")
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.")
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.")
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.")
                break;
            default:
                alert("UNKNOWN_ERROR")
        }
    }
    setActive = () => {
        this.setState({
            active: !this.state.active
        })
    }
    updateLocation = async () => {
        console.log('update location')
        const token = this.Auth.getToken('driver')
        var { latitude, longitude, active } = this.state
        var data = { latitude, longitude, active }
        if(active)
        {
            await FetchApi('post','/api/driver/active', data, token)
                .then(res => {
                    console.log(res.data)
                })
                .catch(err => {
                    console.log(err.response)
                })
        }
        else
        {
            console.log('Driver is not available')
        }
    }
    componentWillUnmount() {
        console.log('unmounted')
        clearInterval(this.refreshInterval)
        clearInterval(this.showRidesInterval)
        navigator.geolocation.clearWatch(this.watchId);
    }
    render()
    {
        var { active, activeRides } = this.state
        return(
            <div>
                <Link to="/">
                    <Button className={styles.homeButton} variant="contained" color="primary">
                        Home
                    </Button>
                </Link>
                {this.state.latitude  && this.state.longitude ?
                <Map center={[this.state.latitude,this.state.longitude]} zoom={12} touchZoom={false} zoomSnap={0} dragging={true} doubleClickZoom={false} boxZoom={false}>
                    <TileLayer attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker 
                        position={[this.state.latitude,this.state.longitude]} 
                        icon={carIcon}
                    />
                </Map>
                :
                null}
            {!active? <Button onClick={this.setActive} variant="contained" color="primary">
                Set Active
            </Button> :
            <Button onClick={this.setActive} color="primary">
                Set InActive
            </Button>}
            <Logout user="driver" history={this.props.history} updateAuthentication={this.props.updateAuthentication}/>
            {activeRides && activeRides.length>0 ? activeRides.map((rider, index) => {
                return (
            <div>
                <div>
                    { rider.riderId.name }
                </div>
                <Button onClick = {() => this.acceptRide(rider)}color="primary" variant="contained">
                    Accept Ride
                </Button>
            </div>
                )})
              :
             <div>
                 No rides available
             </div>
            }
            </div>
        )
    }
}
