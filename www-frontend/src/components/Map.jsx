// Map.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

// Constants
const MAPS_LIBRARY = 'maps';
const MARKER_LIBRARY = 'marker';
const GOOGLE_MAPS_LIBRARIES = [MAPS_LIBRARY, MARKER_LIBRARY];

// Utils
const randomCoordinates =
  ({ lat, lng }) =>
  () => ({
    lat: lat + (Math.random() * 2 - 1) * 0.9,
    lng: lng + (Math.random() * 2 - 1) * 0.9,
  });

// Custom Hook
const useLoadGMapsLibraries = () => {
  const [libraries, setLibraries] = useState();
  
  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    });
    
    const promises = GOOGLE_MAPS_LIBRARIES.map((name) =>
      loader.importLibrary(name).then((lib) => [name, lib])
    );
    
    Promise.all(promises).then((libs) =>
      setLibraries(Object.fromEntries(libs))
    );
  }, []);
  
  return libraries;
};

// Map Component
const MAP_CENTER = { lat: -33.4039996, lng: -70.5074689 };

const Map = () => {
  const libraries = useLoadGMapsLibraries();
  const markerCluster = useRef();
  const mapNodeRef = useRef();
  const mapRef = useRef();
  
  useEffect(() => {
    if (!libraries) {
      return;
    }
    
    console.log(mapNodeRef.current);
    const { Map: GoogleMap } = libraries[MAPS_LIBRARY];
    mapRef.current = new GoogleMap(mapNodeRef.current, {
      mapId: 'DEMO_MAP_ID',
      center: MAP_CENTER,
      zoom: 7,
    });
    
    const { AdvancedMarkerElement: Marker } = libraries[MARKER_LIBRARY];
    const positions = Array.from({ length: 10 }, randomCoordinates(MAP_CENTER));
    const markers = positions.map((position) => new Marker({ position }));
    markerCluster.current = new MarkerClusterer({
      map: mapRef.current,
      markers,
    });
  }, [libraries]);
  
  if (!libraries) {
    return <h1>Cargando...</h1>;
  }
  
  return <div ref={mapNodeRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default Map;
