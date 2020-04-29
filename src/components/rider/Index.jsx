import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

export default class Rider extends React.Component {
    render()
    {
        return (
            <div>
                <Map center={[29.869370600000003,77.8950389]} zoom={12} touchZoom={false} zoomSnap={0} dragging={false} doubleClickZoom={false} zoomSnap={0} boxZoom={false}>

                    <TileLayer attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                </Map>
                Rider
            </div>
        )
    }
}
