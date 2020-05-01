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
export default class Rider extends React.Component {
    constructor()
    {
        super()
        this.state = {
            latitude: '',
            longitude: '',
            drivers: '',
            wait: false,
            book: false
        }
        this.Auth = new AuthService()
    }
    async componentDidMount() 
    {
        this.getLocation()
        this.refreshInterval = setInterval(this.updateLocation, 10000)
        this.activeDriverInterval = setInterval(this.getActiveDrivers,5000)
    }
    riderBookingStatus = async () => {
        let token = this.Auth.getToken('rider')
        await FetchApi('get', '/api/booking/riderBookedStatus', null, token)
            .then(res => {
                console.log(res.data)
                if(res.data)
                {
                    this.props.history.push(`/rider/${res.data.data.riderId}`)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    getActiveDrivers = async () => {
        await FetchApi('get','/api/rider/getDrivers',null)
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
    getLocation = () => {
        if (navigator.geolocation) {
            // navigator.geolocation.getCurrentPosition(this.getCoordinates,this.handleErrors)
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
    bookCab = async () => {
        let riderLat,riderLong,driverLat,driverLong,driverId,riderId
        let x2 = this.state.latitude
        let y2 = this.state.longitude
        let minDis = 0, count = 0
        this.state.drivers.map((cab, index) => {
            let x1 = cab.latitude
            let y1 = cab.longitude
            let dis = this.getDistanceFromLatLonInKm(x2,y2,x1,y1)
            if(dis<=minDis)
            {
                minDis=dis
                driverId=cab._userId
                riderLat=x2
                riderLong=y2
                driverLat=x1
                driverLong=y1
            }
            count++
            console.log(dis)
        })
        console.log(count,'count')
        if(count > 0)
        {
            let token = this.Auth.getToken('rider')
            const riderId = this.props.userData._id
            const data = { riderId, driverId, driverLat, driverLong, riderLat, riderLong }
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
            this.riderStatusInteval = setInterval(this.riderBookingStatus,2000)
        }
    }
    componentWillUnmount() {
        console.log('unmounted')
        clearInterval(this.refreshInterval)
        clearInterval(this.activeDriverInterval)
        navigator.geolocation.clearWatch(this.watchId);
    }
    render()
    {
        const { drivers, book, wait } = this.state
        return (
            <div>
                {this.state.longitude && this.state.latitude ?
                <Map center={[this.state.latitude,this.state.longitude]} zoom={12} touchZoom={false} zoomSnap={0} dragging={true} doubleClickZoom={false} boxZoom={false}>
                    <TileLayer attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker 
                        position={[this.state.latitude,this.state.longitude]} 
                    />
                    {drivers? drivers.map((cab,index) => (
                        <Marker 
                            icon={carIcon}
                            position={[cab.latitude,cab.longitude]}
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
            </div>
        )
    }
}
