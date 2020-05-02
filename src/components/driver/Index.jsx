import React from 'react'
import { Link } from 'react-router-dom'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { Icon } from 'leaflet'
import FetchApi from '../../utils/FetchApi'
import AuthService from '../../handlers/AuthService'
import { Button } from '@material-ui/core'
import Logout from '../logout/Logout'
import BookingDashboard from './Bookings'
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
            rideMode: false,
            activeStatus: false,
            riderDetails: '',
            riderLat:'',
            riderLong:'',
        }
        this.Auth = new AuthService()
    }
    componentDidMount() {
        this.getLocation()
        this.availableRidesInterval= setInterval(this.availableRides, 2000);
        this.setActiveInterval = setInterval(this.recheckActiveStatus,2000)
    }
    updateRideMode = () => {
        this.setState({
            rideMode: false
        })
    }
    getLocation = () => {
        if (navigator.geolocation) {
            this.watchId = navigator.geolocation.watchPosition(this.getCoordinates, this.handleErrors)
        } else {
            alert("Geolocation is not supported by this browser.")
        }
    }
    getCoordinates = (position) => {
        this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
        this.updateLocation()
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
        const token = this.Auth.getToken('driver')
        var { latitude, longitude } = this.state
        var data = { latitude, longitude }
        await FetchApi('post','/api/driver/updateLocation', data, token)
            .then(res => {
                if(res && res.data && res.data.data)
                {
                    this.props.updateUserData(res.data.data)
                }
            })
            .catch(err => {
                    this.setState({
                        error: err
                    })
            })
    }
    setDriverActive = async () => {
        const token = this.Auth.getToken('driver')
        await FetchApi('post', '/api/driver/setDriverActive', null, token)
            .then(res=>{
                this.setState({
                    activeStatus: true
                })
            })
            .catch(err=> {
                    this.setState({
                        error: err
                    })
            })
    }
    setDriverInactive = async () => {
        const token = this.Auth.getToken('driver')
        await FetchApi('post', '/api/driver/setDriverInactive', null, token)
            .then(res=>{
                this.setState({
                    activeStatus: false
                })
            })
            .catch(err => {
                    this.setState({
                        error: err
                    })
            })
    }
    recheckActiveStatus = async () => {
        if(this.state.activeStatus)
        {
            this.setDriverActive()
        }
    }
    availableRides = async () => {
        let token = this.Auth.getToken('driver')
        if(token)
        {
            await FetchApi('get','/api/booking/availableRides',null,token)
                .then(res => {
                    if(res && res.data)
                    {
                        this.setState({
                            activeRides: res.data.data
                        })
                    }
                })
                .catch(err => {
                    this.setState({
                        error: err
                    })
                })
        }
    }
    getRiderLiveLocation = async (req, res) => {
        var _id = this.state.riderDetails._id
        var data = {_id}
        if(data)
        {
            await FetchApi('post','/api/rider/getLiveLocation',data)
                .then(res => {
                    if(res && res.data)
                    {
                        this.setState({
                            riderLat: res.data.data.latitude,
                            riderLong: res.data.data.longitude
                        })
                    }
                })
                .catch(err => {
                    this.setState({
                        error: err
                    })
                })
        }
    }
    acceptRide = async (ride) => {
        const token = this.Auth.getToken('driver')
        if(token)
        {
            const _id = ride._id
            const data = { _id }
            await FetchApi('post','/api/booking/driverConfirmation',data,token)
                .then(res => {
                    this.setDriverInactive()
                    this.setState({
                        rideMode: true,
                        riderDetails: res.data.data.riderId,
                        riderLat: res.data.data.riderId.latitude,
                        riderLong: res.data.data.riderId.longitude,
                        activeRides: ''
                    })
                    this.getRiderLocationInterval = setInterval(this.getRiderLiveLocation,2000)
                    // this.props.history.push(`/driver/${res.data.data.driverId}`)
                })
                .catch(err => {
                    this.setState({
                        error: err
                    })
                })
        }
    }
    async componentWillUnmount() {
        clearInterval(this.availableRidesInterval)
        clearInterval(this.setActiveInterval)
        clearInterval(this.getRiderLocationInterval)
        navigator.geolocation.clearWatch(this.watchId);
    }
    render()
    {
        var { rideMode, activeStatus, activeRides, riderLat, riderLong, longitude, latitude, riderDetails } = this.state
        return(
            <div>
                {!rideMode ?
                <React.Fragment>
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
                            {!activeStatus? <Button onClick={this.setDriverActive} variant="contained" color="primary">
                            Set Active
                                    </Button> :
                                    <Button onClick={this.setDriverInactive} color="primary">
                                        Set InActive
                                    </Button>}
                                        <Logout user="driver" history={this.props.history} updateAuthentication={this.props.updateAuthentication}/>
                    {activeRides && activeRides.length>0 ? activeRides.map((rider, index) => {
                        return (
                            <div key={index}>
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
                </React.Fragment>
            :
            <BookingDashboard 
                driverLat={latitude}
                driverLong={longitude}
                riderLat={riderLat}
                riderLong={riderLong}
                riderDetails={riderDetails}
                driverDetails={this.props.userData}
                updateRideMode={this.updateRideMode}
            />
             }
            </div>
        )
    }
}
