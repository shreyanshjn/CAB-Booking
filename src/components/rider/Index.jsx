import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { details } from './data/sample'

export default class Rider extends React.Component {
    constructor()
    {
        super()
        this.state = {
            latitude: '',
            longitude: ''
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
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.displayLocationInfo);
        }
        const watcher = navigator.geolocation.watchPosition(this.displayLocationInfo);

        // setTimeout(() => {
        //     navigator.geolocation.clearWatch(watcher);
        // }, 15000);
        return (
            <div>
                <Map center={[29.869370600000003,77.8950389]} zoom={12} touchZoom={false} zoomSnap={0} dragging={true} doubleClickZoom={false} zoomSnap={0} boxZoom={false}>

                    <TileLayer attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[this.state.longitude,this.state.latitude]} />
                    {/* <Marker position={[29.864370600000003,77.8950389]} /> */}
                </Map>

            </div>
        )
    }
}
