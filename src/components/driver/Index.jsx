import React from 'react'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { Icon } from 'leaflet'
import FetchApi from '../../utils/FetchApi'
import AuthService from '../../handlers/AuthService'
import { Button } from '@material-ui/core'
import Logout from '../logout/Logout'

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
            active: false
        }
        this.Auth = new AuthService()
    }
    async componentDidMount() {

    }
    setActive = () => {
        this.setState({
            active: !this.state.active
        })
    }
    displayLocationInfo = (position) => {
        this.setState({
            latitude: position.coords.longitude,
            longitude: position.coords.latitude
        })
    }
    updateLocation = async () => {
        const token = this.Auth.getToken('driver')
        var { latitude, longitude, active } = this.state
        var data = { latitude, longitude, active }
        data.active=true
        if(active)
            var fetchData= await FetchApi('post','/api/driver/active', data, token)
        console.log(fetchData);
    }
    render()
    {
        var { active } = this.state
        // setInterval(this.updateLocation,20000)
        this.updateLocation()
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.displayLocationInfo);
        }
        return(
            <div>
                <Map center={[this.state.longitude,this.state.latitude]} zoom={12} touchZoom={false} zoomSnap={0} dragging={true} doubleClickZoom={false} boxZoom={false}>

                    <TileLayer attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker 
                        position={[this.state.longitude,this.state.latitude]} 
                        icon={carIcon}
                    />
            </Map>
            {!active? <Button onClick={this.setActive} variant="contained" color="primary">
                Set Active
            </Button> :
            <Button onClick={this.setActive} color="primary">
                Set InActive
            </Button>}
            <Logout user="driver" history={this.props.history} updateAuthentication={this.props.updateAuthentication}/>
            </div>
        )
    }
}
