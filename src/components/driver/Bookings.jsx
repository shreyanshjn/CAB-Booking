import React from 'react'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { Icon } from 'leaflet'
import { Button, Box } from '@material-ui/core'
import FetchApi from '../../utils/FetchApi'
import AuthService from '../../handlers/AuthService'

var carIcon = new Icon({
    iconUrl: '/car.svg',
    iconSize: [50,50]
})
export default class DriverDashboard extends React.Component {
    constructor()
    {
        super()
        this.Auth = new AuthService()
    }
    endRide = async () => {
        this.props.updateRideMode()
        const token = this.Auth.getToken('driver')
        await FetchApi('post','/api/booking/endRide', null, token)
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }
    render()
    {
        console.log(this.props)
        let { driverLat, driverLong, riderLat, riderLong, riderDetails, driverDetails } = this.props
        return (
            <React.Fragment>
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
                <Box component="span" m={8} color="text.primary">
                    Rider-Name:- {riderDetails.name}
                </Box>
                <Box component="span" m={8}>
                    <Button onClick={this.endRide} variant="contained" color="secondary">
                        End the ride
                    </Button>
                </Box>
            </React.Fragment>
        )
    }
}
