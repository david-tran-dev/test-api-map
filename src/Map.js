import { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMapEvent, Polyline } from "react-leaflet";
// import 'leaflet/dist/leaflet.css';
import './map.scss';
import gpxParser from 'gpxparser';

const Map = () => {
	const [positions, setPositions] = useState([]);
	const mapRef = useRef();
	const defaultPosition = [45.4462, 6.2905]; // Paris position
	

	const LocationMarker = () => {
		const [position, setPosition] = useState(null)
		const map = useMapEvent('click', 
			() => {
				console.log(positions[0][0]);
				if(positions.length > 0) {
					const [lat, lng] = positions[0][0];
					const firstPosition = {lat, lng};
					console.log('firstPosition:', firstPosition)
					setPosition({lat: 45.4462, lng: 6.2900})
					map.flyTo(firstPosition, map.getZoom())
				}
				
			}
		)
		return position === null ? null : (
			<Marker position={position}>
				<Popup>You are here</Popup>
			</Marker>
		)
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
	}
	
	const handleChange = async (e) => {
		let gpx = new gpxParser();
		gpx.parse(await e.target.files[0].text());
	
		setPositions(gpx.tracks.map((track) => {
			const positions = track.points.map(p => [p.lat, p.lon]
			) 
			return positions}))

			const { current = {}} = mapRef;
			const {leafletElement: map} = current;
			map.setView(positions[0][0], 14)
		}
		
		console.log(positions); 
  return (
		<div className="map">
      <MapContainer
				ref={mapRef}
        center={defaultPosition}
        zoom={13}
				style={{width: '100%', height: '100%'}}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'
        />
				<Marker position={defaultPosition}>
        <Popup>
          <a href="http://google.com">A pretty CSS3 popup.</a> <br /> Easily customizable.
        </Popup>
      </Marker>
			<LocationMarker />
			<Polyline
	            pathOptions={{ fillColor: 'red', color: 'blue' }}
	            positions={positions}
            />
      </MapContainer>
			<form onSubmit={handleSubmit}>
			<label htmlFor="file">
				<input type="file" id="file" onChange={handleChange}/>
				<button type="submit">
					Import your gpx file
					</button>
			</label>
			</form>
		</div>
  );
};

export default Map