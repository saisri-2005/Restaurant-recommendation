import React, { useState, useEffect, useRef } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapComponent = ({ restaurants, selectedRestaurant, setSelectedRestaurant }) => {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const mapboxToken =
    "pk.eyJ1Ijoic2Fpc3JpLWNob3dkYXJ5IiwiYSI6ImNtZ3kzNWM0dzE2eHkybHNicjNhcjA3bXkifQ.bx2wORK37DBq4-4e5AK6wA";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error(err)
    );
  }, []);

  useEffect(() => {
    if (mapRef.current && selectedRestaurant) {
      const map = mapRef.current.getMap();
      map.flyTo({ center: [selectedRestaurant.lng, selectedRestaurant.lat], zoom: 12 });
    }
  }, [selectedRestaurant]);

  return (
    <Map
      ref={mapRef}
      initialViewState={{ latitude: 20.5937, longitude: 78.9629, zoom: 4 }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={mapboxToken}
    >
      <NavigationControl position="top-right" />

      {/* User location */}
      {userLocation && <Marker latitude={userLocation.lat} longitude={userLocation.lng} color="blue" />}

      {/* Restaurant markers */}
      {restaurants.map((r) =>
        r.lat && r.lng ? (
          <Marker
            key={r._id}
            latitude={r.lat}
            longitude={r.lng}
            color={selectedRestaurant?._id === r._id ? "green" : "red"}
          />
        ) : null
      )}

      {/* Popup */}
      {selectedRestaurant && userLocation && (
        <Popup
          latitude={selectedRestaurant.lat}
          longitude={selectedRestaurant.lng}
          anchor="top"
          onClose={() => setSelectedRestaurant(null)}
        >
          <div style={{ minWidth: '180px', fontFamily: 'Poppins, sans-serif' }}>
            <strong style={{ fontSize: '16px' }}>{selectedRestaurant.name}</strong>
            <div style={{ margin: '5px 0' }}>
              {selectedRestaurant.cuisine.map(c => (
                <span
                  key={c}
                  style={{
                    display: 'inline-block',
                    background: '#007bff',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '5px',
                    marginRight: '5px',
                    fontSize: '12px',
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
            <div>⭐ {selectedRestaurant.rating}</div>
            <div>{selectedRestaurant.location}</div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedRestaurant.lat},${selectedRestaurant.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', marginTop: '8px', padding: '6px 10px', background: '#007bff', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}
            >
              Get Directions
            </a>
          </div>
        </Popup>
      )}
    </Map>
  );
};

export default MapComponent;