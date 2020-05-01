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
export default class BookingDriver extends React.Component {
    constructor()
    {
        super()
        this.state = {
            riderLat: '',
            riderLong: '',
            driverLong: '',
            driverLat: '',
            activeRides: '',
            active: false
        }
        this.Auth = new AuthService()
    }
    componentDidMount() {
        this.getLocation()
        // this.refreshInterval = setInterval(this.updateLocation, 10000);
        this.bookingStatus();
    }
    bookingStatus = async () => {
        let token = this.Auth.getToken('driver')
        let user = 'driver'
        let data = { user }
        await FetchApi('post','/api/booking/bookingDetails',data,token)
            .then(res => {
                console.log(res.data)
                this.setState({
                    riderLat: res.data.data.riderLat,
                    riderLong: res.data.data.riderLong,
                    driverLat: res.data.data.driverLat,
                    driverLong: res.data.data.driverLong,
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    getLocation = () => {
        if (navigator.geolocation) {
            this.watchId = navigator.geolocation.watchPosition(this.getCoordinates,this.handleErrors)
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
        navigator.geolocation.clearWatch(this.watchId);
    }
    render()
    {
        let { driverLat, driverLong, riderLat, riderLong } = this.state
        return(
            <div>
                <Link to="/">
                    <Button className={styles.homeButton} variant="contained" color="primary">
                        Home
                    </Button>
                </Link>
                {driverLong && driverLat && riderLat && riderLong?
                <Map center={[driverLat,driverLong]} zoom={12} touchZoom={false} zoomSnap={0} dragging={true} doubleClickZoom={false} boxZoom={false}>
                    <TileLayer attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker 
                        position={[driverLat,driverLong]} 
                        icon={carIcon}
                    />
                    <Marker 
                        position={[riderLat,riderLong]} 
                    />
                </Map>
                :
                null}
            </div>
        )
    }
}
