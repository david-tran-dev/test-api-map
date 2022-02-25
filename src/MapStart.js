/* eslint-disable react/no-array-index-key */
import { useEffect, useRef, useState } from 'react';
import {
  MapContainer, TileLayer, Marker, Popup, Polyline, LayersControl, LayerGroup, Circle, FeatureGroup, useMap,
} from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
import './map.scss';
import L from 'leaflet';

function MapStart() {
  const [firstPosition, SetFirstPosition] = useState([48.860647513789694, 2.340337536855448]);
  const [positions, setPositions] = useState([]);
  const [wayPoints, setWayPoints] = useState([]);

  const mapRef = useRef();

  const getIcon = (iconSize) => L.icon({
    iconUrl: require('./assets/icons/paragliding.png'),
    iconSize: [iconSize],
    iconAnchor: [20, 30],
  });

  function LocationMarker() {
    const map = useMap();
    useEffect(() => {
      map.locate().on('locationfound', (e) => {
        SetFirstPosition(e.latlng);
        console.log('e.latlng:', e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        const radius = e.accuracy;
        console.log('radius:', Math.round(radius));
        const circle = L.circle(e.latlng, radius);
        circle.addTo(map);
      });
    }, [map]);

    return null;
  }

  // return firstPosition === null ? null : (
  // <Marker position={firstPosition}>
  // <Popup>You are here</Popup>
  // </Marker>
  // )

  // const handleInputFile = async (e) => {
  //   const gpx = new gpxParser();
  //   gpx.parse(await e.target.files[0].text());
  //   console.log('gpx: ', gpx);
  //   const trackName = gpx.metadata.name;
  //   console.log('trackName:', trackName);
  //   setWayPoints(gpx.waypoints);

  //   setPositions(gpx.tracks.map((track) => {
  //     const positions = track.points.map((p) => [p.lat, p.lon]);
  //     return positions;
  //   }));

  // const { current = {}} = mapRef;
  // const {leafletElement: map} = current;
  // map.setView(positions[0][0], 14)
  // setTrackName(trackName);

  console.log(positions);
  return (
    <div className="map">
      <MapContainer
        center={firstPosition}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
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
              url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OpenTopoMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
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
              {wayPoints.length > 0 && wayPoints.map(({
                ele, lat, lon, name,
              }, index) => (
                <Marker key={index + name} position={[lat, lon]} icon={getIcon(40)}>
                  <Popup>Nom: {name} <br />
                    Hauteur: {ele}m
                  </Popup>
                </Marker>
              ))}
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

    </div>
  );
}

export default MapStart;
