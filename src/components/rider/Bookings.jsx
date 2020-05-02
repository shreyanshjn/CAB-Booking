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
        this.state = {
            error: ''
        }
        this.Auth = new AuthService()
    }
    render()
    {
        let { driverLat, driverLong, riderLat, riderLong, riderDetails, driverDetails } = this.props
        return (
            <React.Fragment>
                <Map center={[riderLat,riderLong]} zoom={12} touchZoom={false} zoomSnap={0} dragging={true} doubleClickZoom={false} boxZoom={false}>
                    <TileLayer attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker 
                        position={[riderLat,riderLong]} 
                    />
                    <Marker 
                        position={[driverLat,driverLong]} 
                        icon={carIcon}
                    />
            </Map>
                <Box component="span" m={8} color="text.primary">
                    Driver-Name:- {driverDetails.name}
                    Driver-Phone:- {driverDetails.phone}
                </Box>
            </React.Fragment>
        )
    }
}
