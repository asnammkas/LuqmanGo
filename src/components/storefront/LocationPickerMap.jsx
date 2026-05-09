import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Search } from 'lucide-react';

// Fix for default marker icon in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const DEFAULT_CENTER = { lat: 6.9271, lng: 79.8612 }; // Colombo, Sri Lanka

function DraggableMarker({ position, setPosition }) {
  const markerRef = useRef(null);
  
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    [setPosition],
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
}

// Helper to pan to a location
function MapPanner({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 16);
    }
  }, [center, map]);
  return null;
}

const LocationPickerMap = ({ onLocationSelect, initialLocation }) => {
  const [position, setPosition] = useState(initialLocation || DEFAULT_CENTER);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Notify parent whenever position changes
  useEffect(() => {
    onLocationSelect({ lat: position.lat, lng: position.lng });
  }, [position, onLocationSelect]);

  const handleGetMyLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    setSearchError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(newPos);
        setIsLocating(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSearch = useCallback(async () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    
    setIsSearching(true);
    setSearchError('');
    
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed)}&limit=1&countrycodes=lk`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      
      if (data && data.length > 0) {
        const newPos = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        setPosition(newPos);
      } else {
        setSearchError('Location not found. Try a different search.');
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchError('Search failed. Check your connection.');
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
      {/* Search bar + Locate Me row */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <div style={{ 
          flex: 1, display: 'flex', alignItems: 'center',
          border: '1px solid var(--color-border)', borderRadius: '8px', 
          background: '#fff', overflow: 'hidden'
        }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search a place..."
            style={{
              flex: 1, border: 'none', outline: 'none', padding: '0.55rem 0.75rem',
              fontSize: '0.85rem', background: 'transparent', color: 'var(--color-text-main)'
            }}
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            style={{
              background: 'none', border: 'none', padding: '0.5rem 0.65rem',
              cursor: isSearching ? 'wait' : 'pointer', color: '#113013',
              display: 'flex', alignItems: 'center'
            }}
          >
            <Search size={16} />
          </button>
        </div>

        <button 
          type="button" 
          onClick={handleGetMyLocation}
          disabled={isLocating}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.3rem',
            background: '#fff', border: '1px solid var(--color-border)', borderRadius: '8px',
            color: '#113013', fontSize: '0.8rem', fontWeight: 600, 
            cursor: 'pointer', padding: '0.55rem 0.75rem', whiteSpace: 'nowrap'
          }}
        >
          <MapPin size={14} />
          {isLocating ? '...' : 'Me'}
        </button>
      </div>

      {/* Search error message */}
      {searchError && (
        <p style={{ color: '#EF4444', fontSize: '0.75rem', margin: 0 }}>{searchError}</p>
      )}

      {/* Hint text */}
      <span style={{ fontSize: '0.78rem', color: '#888' }}>
        Search or drag the pin to the exact delivery spot
      </span>

      {/* Map */}
      <div style={{ 
        height: '250px', 
        width: '100%', 
        borderRadius: '12px', 
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        position: 'relative',
        zIndex: 1
      }}>
        <MapContainer 
          center={position} 
          zoom={13} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapPanner center={position} />
          <DraggableMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationPickerMap;
