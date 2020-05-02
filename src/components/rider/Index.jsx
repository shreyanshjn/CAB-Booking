import React from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet'
import { Icon } from 'leaflet'
import { Button, CircularProgress } from '@material-ui/core'
import FetchApi from '../../utils/FetchApi'
import AuthService from '../../handlers/AuthService'
import Logout from '../logout/Logout'

var carIcon = new Icon({
    iconUrl: '/pickup-car.svg',
    iconSize: [25,25]
})
var timeRun = 1
export default class Rider extends React.Component {
    constructor()
    {
        super()
        this.state = {
            latitude: '',
            longitude: '',
            drivers: '',
            wait: false,
            book: false,
            rideMode: false,
            error: false
        }
        this.Auth = new AuthService()
    }
    async componentDidMount() 
    {
        this.getLocation();
        this.activeDriverInterval = setInterval(this.getActiveDrivers,2000)
    }
    getLocation = () => {
        if (navigator.geolocation) {
            // navigator.geolocation.getCurrentPosition(this.getCoordinates,this.handleErrors)
            this.watchId = navigator.geolocation.watchPosition(this.getCoordinates, this.handleErrors)
        } else {
            alert("Geolocation is not supported by this browser.")
        }
    }
    getCoordinates = (position) => {
        console.log('done')
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
        const token = this.Auth.getToken('rider')
        var { latitude, longitude } = this.state
        var data = { latitude, longitude }
        await FetchApi('post','/api/rider/updateLocation', data, token)
            .then(res => {
                if(res && res.data && res.data.data)
                {
                    this.props.updateUserData(res.data.data)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    getActiveDrivers = async () => {
        await FetchApi('get','/api/driver/activeDrivers',null)
            .then(res => {
                console.log(res.data)
                if(res && res.data.success && res.data.data)
                {
                    this.setState({
                        drivers: res.data.data
                    })
                    if(res.data.data.length>0)
                    {
                        this.setState({
                            book: true
                        })
                    }
                    else
                    {
                        this.setState({
                            book: false
                        })
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    riderBookingStatus = async () => {
        timeRun+=1
        if(timeRun==60)
        {
            this.setState({
                wait: false
            })
            clearInterval(this.riderStatusInterval)
        }
        let token = this.Auth.getToken('rider')
        try
        {

        await FetchApi('get', '/api/booking/riderBookedStatus', null, token)
            .then(res => {
                console.log(res.data)
                if(res.data)
                {
                    clearInterval(this.activeDriverInterval)
                    // clearInterval(this.riderStatusInterval)
                    this.setState({
                        rideMode: true
                    })
                    // this.props.history.push(`/rider/${res.data.data.riderId}`)
                }
            })
        }
        catch(err)
        {
            console.log(err.response)
        }
    }
    getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2-lon1); 
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
    }
    deg2rad = (deg) => {
        return deg * (Math.PI/180)
    }
    bookCab = async () => {
        let driverId,riderId
        let x2 = this.state.latitude
        let y2 = this.state.longitude
        let minDis = 10000000, count = 0
        this.state.drivers.map((cab, index) => {
            let x1 = cab.driverId.latitude
            let y1 = cab.driverId.longitude
            let dis = this.getDistanceFromLatLonInKm(x2,y2,x1,y1)
            console.log(dis,'distance')
            console.log(cab)
            if(dis<=minDis) 
            {
                minDis=dis
                driverId=cab.driverId._id
                count++
            }
            console.log(dis)
        })
        console.log(count,'count')
        if(count > 0)
        {
            let token = this.Auth.getToken('rider')
            const riderId = this.props.userData._id
            const data = { riderId, driverId }
            console.log(data,'book cab')
            await FetchApi('post','/api/booking/bookRide',data, token)
                .then(res => {
                    console.log(res.data)
                    this.setState({
                        wait: true
                    })
                })
                .catch(err => {
                    console.log(err)
                })
            this.riderStatusInterval = setInterval(this.riderBookingStatus,2000)
        }
    }
    componentWillUnmount() {
        console.log('unmounted')
        clearInterval(this.activeDriverInterval)
        clearInterval(this.riderStatusInterval)
        navigator.geolocation.clearWatch(this.watchId);
    }
    render()
    {
        const { rideMode, drivers, book, wait } = this.state
        return (
            <div>
                {!rideMode ? 
                <React.Fragment>
                    {this.state.longitude && this.state.latitude ?
                    <Map center={[this.state.latitude,this.state.longitude]} zoom={12} touchZoom={false} zoomSnap={0} dragging={true} doubleClickZoom={false} boxZoom={false}>
                        <TileLayer attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker 
                            position={[this.state.latitude,this.state.longitude]} 
                            />
                            {drivers? drivers.map((cab,index) => (
                                <Marker 
                                icon={carIcon}
                                position={[cab.driverId.latitude,cab.driverId.longitude]}
                                key={index}
                                />
                            ))
                            :null}
                        </Map>: 
                            <div>
                                You need to give location permission
                            </div>
                    }
                {wait ?
                <CircularProgress color="secondary" />
                        :
                        book ?<Button variant="contained" onClick={this.bookCab} color="primary">
                        Book a Ride
                        </Button> :
                        <div>
                            No cabs available
                        </div>}
                        <Logout user="rider" history={this.props.history} updateAuthentication={this.props.updateAuthentication} />
                    </React.Fragment>
                :
                <div>
                    ok
                </div>}
            </div>
        )
    }
}
