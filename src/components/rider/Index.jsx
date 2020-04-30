import React from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet'
import { Icon } from 'leaflet'
import FetchApi from '../../utils/FetchApi'
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
            drivers: ''
        }
    }
    async componentDidMount() 
    {
        var drivers = await FetchApi('get','/api/rider/getDrivers',null)
        if(drivers && drivers.data && drivers.data.success)
        {
            this.setState({
                drivers: drivers.data.data
            })
        }
        else
        {
            console.log('error occured')
        }

    }
    displayLocationInfo = (position) => {
        this.setState({
            latitude: position.coords.longitude,
            longitude: position.coords.latitude
        })
        console.log(this.state.latitude)
    }
    render()
    {
        console.log(this.props)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.displayLocationInfo);
        }
        // const watcher = navigator.geolocation.watchPosition(this.displayLocationInfo);
        const { drivers } = this.state
        // console.log(drivers)
        // setTimeout(() => {
        //     navigator.geolocation.clearWatch(watcher);
        // }, 15000);
        return (
            <div>
                <Map center={[this.state.longitude,this.state.latitude]} zoom={12} touchZoom={false} zoomSnap={0} dragging={true} doubleClickZoom={false} boxZoom={false}>

                    <TileLayer attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker 
                        position={[this.state.longitude,this.state.latitude]} 
                    />
                    {drivers? drivers.map((cab,index) => (
                        <Marker 
                            icon={carIcon}
                            position={[cab.longitude,cab.latitude]}
                            key={index}
                        />
                    ))
                    :null}
                </Map>
                <Logout user="rider" history={this.props.history} updateAuthentication={this.props.updateAuthentication} />
            </div>
        )
    }
}
