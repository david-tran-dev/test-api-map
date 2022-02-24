import { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMapEvent, Polyline, LayersControl, LayerGroup, Circle, FeatureGroup, Rectangle } from "react-leaflet";
// import 'leaflet/dist/leaflet.css';
import './map.scss';
import L from 'leaflet'
import gpxParser from 'gpxparser';

const Map = () => {
	const [firstPosition, SetFirstPosition] = useState([48.860647513789694, 2.340337536855448]);
	const [positions, setPositions] = useState([]);
	const [trackName, setTrackName] = useState('');
	const [wayPoints, setWayPoints] = useState([]);

	const mapRef = useRef();
	const defaultPosition = [45.4462, 6.2905]; // Paris position
	
	const getIcon = (iconSize) => {
		return L.icon( {
			iconUrl: require('./assets/icons/paragliding.png'),
			iconSize: [iconSize],
			iconAnchor: [20,30]
		})
	}

	const LocationMarker = () => {
		// const [position, setPosition] = useState(null)
		const map = useMapEvent('click', 
			() => {
				if(positions.length > 0) {
					SetFirstPosition(positions[0][0])
					const [lat, lng] = positions[0][0];
					const firstPosition = {lat, lng};
					map.flyTo(firstPosition, map.getZoom())
				}
				
			}
		)
		return null;
		// return firstPosition === null ? null : (
		// 	<Marker position={firstPosition}>
		// 		<Popup>You are here</Popup>
		// 	</Marker>
		// )
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
	}
	
	const handleInputFile = async (e) => {
		let gpx = new gpxParser();
		gpx.parse(await e.target.files[0].text());
		console.log('gpx: ', gpx);
		const trackName = gpx.metadata.name;
		console.log('trackName:', trackName)
		setWayPoints(gpx.waypoints);

		setPositions(gpx.tracks.map((track) => {
			const positions = track.points.map(p => [p.lat, p.lon]) 
			return positions
		}))

		// const { current = {}} = mapRef;
		// const {leafletElement: map} = current;
		// map.setView(positions[0][0], 14)
		setTrackName(trackName);
		
		
	}


		
		console.log(positions); 
  return (
		<div className="map">
      <MapContainer
        center={firstPosition}
        zoom={13}
				style={{width: '100%', height: '100%'}}
      >
        
			
				<LocationMarker />
				<Polyline
								pathOptions={{ fillColor: 'red', color: 'blue' }}
								positions={positions}
							/>


					<LayersControl position="topright">
					<LayersControl.BaseLayer checked name="OpenStreetMap.Mapnik">
					<TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'
        />
					</LayersControl.BaseLayer>
					<LayersControl.BaseLayer name="OpenTopoMap">
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
						/>
					</LayersControl.BaseLayer>
					<LayersControl.Overlay checked name="Marker with popup">
						<Marker position={firstPosition}>
							<Popup>
								A pretty CSS3 popup. <br /> Easily customizable.
							</Popup>
						</Marker>
					</LayersControl.Overlay>
					<LayersControl.Overlay checked name="Point de passage">
						<LayerGroup>
						{wayPoints.length > 0 && wayPoints.map(({ele, lat, lon, name}, index) => {
					return (
						<Marker key={index} position={[lat, lon]} icon={getIcon(40)}>
							<Popup>Nom: {name} <br />
								Hauteur: {ele}m
							</Popup>
						</Marker>
					)
				})}
						</LayerGroup>
					</LayersControl.Overlay>
					<LayersControl.Overlay name="Feature group">
						<FeatureGroup pathOptions={{ color: 'purple' }}>
							<Popup>Popup in FeatureGroup</Popup>
							<Circle center={[51.51, -0.06]} radius={200} />
							
						</FeatureGroup>
					</LayersControl.Overlay>
				</LayersControl>
      </MapContainer>

			<form onSubmit={handleSubmit}>
			<label htmlFor="file" style={{ background:"grey", padding:"5px 10px" }}>
					Import your gpx file
			</label>
				<input type="file" id="file" onChange={handleInputFile} style={{display: "none"}}/>
			</form>
			{}
			
		</div>
  );
};

export default Map;