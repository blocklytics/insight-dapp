// React
import React, { useState } from "react";

// React Google Maps
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Circle } from "react-google-maps";

// images
import EthereumLogo from './images/ethereum.png';
import Attraction from './images/Attraction.png';
import Food from './images/Food.png';
import Nightlife from './images/Nightlife.png';
import Default from './images/Default.png';

const conventionCenter = { lat: 34.6361063, lng: 135.4145468 }
const mapInitialLoadCenter = { lat: 34.6473048, lng: 135.4331263 }
const mapInitialZoom = 12

function iconForTags(tags) {
	if (tags.includes("Food")) return { url: Food }
	if (tags.includes("Nightlife")) return { url: Nightlife }
	if (tags.includes("Attraction")) return { url: Attraction }
	return { url: Default }
}

const MapContainer = withScriptjs(withGoogleMap((props) => {
	const { points } = props
	const [hoverData, setHoverData] = useState(null)
	
	const styles = [
		{
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#f5f5f5"
				}
			]
		},
		{
			"elementType": "labels.icon",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#616161"
				}
			]
		},
		{
			"elementType": "labels.text.stroke",
			"stylers": [
				{
					"color": "#f5f5f5"
				}
			]
		},
		{
			"featureType": "administrative.land_parcel",
			"elementType": "labels",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "administrative.land_parcel",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#bdbdbd"
				}
			]
		},
		{
			"featureType": "poi",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#eeeeee"
				}
			]
		},
		{
			"featureType": "poi",
			"elementType": "labels.text",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "poi",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#757575"
				}
			]
		},
		{
			"featureType": "poi.business",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "poi.park",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#e5e5e5"
				}
			]
		},
		{
			"featureType": "poi.park",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#9e9e9e"
				}
			]
		},
		{
			"featureType": "road",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#ffffff"
				}
			]
		},
		{
			"featureType": "road",
			"elementType": "labels.icon",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "road.arterial",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#757575"
				}
			]
		},
		{
			"featureType": "road.highway",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#dadada"
				}
			]
		},
		{
			"featureType": "road.highway",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#616161"
				}
			]
		},
		{
			"featureType": "road.local",
			"elementType": "labels",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "road.local",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#9e9e9e"
				}
			]
		},
		{
			"featureType": "transit",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "transit.line",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#e5e5e5"
				}
			]
		},
		{
			"featureType": "transit.station",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#eeeeee"
				}
			]
		},
		{
			"featureType": "water",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#c9c9c9"
				}
			]
		},
		{
			"featureType": "water",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"color": "#9e9e9e"
				}
			]
		}
	]
	
	const circles = []
	var i; for (i=6; i > -1; i--) {
		const prize = 10 * (i + 1)
		const radius = 5000 * (6 - i)
		const opacity = 0.15
		const devcon = ['#fca09a', '#fcccd3', '#ffcc9d', '#98ddad', '#81d7ec', '#a0aaed']
		
		circles.push(<Circle
			key={ i }
			defaultCenter={ conventionCenter }
			defaultRadius={ radius }
			onMouseOver={ () => setHoverData({ prize }) }
			onMouseOut={ () => setHoverData( null ) }
			defaultOptions={{
				strokeWeight: 4,
				strokeColor: `#FFFFFF66`,
				fillColor: devcon[i],
				fillOpacity: opacity,
				zIndex: i,
			}}
		/>)
	}

	return (
		<GoogleMap
			defaultZoom={ mapInitialZoom }
			defaultCenter={ mapInitialLoadCenter }
			defaultOptions={{ styles, streetViewControl: false, mapTypeControl: false, fullscreenControl: false, rotateControl: false }}
		>
			{ hoverData && (
				<div className="map-info-box">
					<strong>{ hoverData.name }</strong>
					{ hoverData.prize && (
						<>
							<strong>{ hoverData.prize } Kovan FOAM zone</strong><br />
							Map your point here to collect a prize.
						</>
					)}
				</div>
			)}
			{ points && points.map(point => 
				<Marker
					key={ point.listingHash }
					position={ point.position }
					icon={ iconForTags(point.tags) }
					onMouseOver={ () => setHoverData({ name: point.name }) }
					onMouseOut={ () => setHoverData(null) }
				/>
			)}
			<Marker
				position={ conventionCenter } 
				icon={{ url: EthereumLogo }}
			/>
			{ circles.map(circle => circle) }
		</GoogleMap>
  )}
))

export default MapContainer