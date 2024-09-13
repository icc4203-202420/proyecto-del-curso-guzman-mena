import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



// Constants
const MAPS_LIBRARY = 'maps';
const MARKER_LIBRARY = 'marker';

const GOOGLE_MAPS_LIBRARIES = [MAPS_LIBRARY, MARKER_LIBRARY];

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
  
  const [bars, setBars] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch bars from the API
    const fetchBars = async () => {
      try {
        const response = await axios.get('/api/v1/bars');
        setBars(response.data.bars);
      } catch (error) {
        console.error('Error fetching bars:', error);
      }
    };
    fetchBars();
  }, []);
  
  useEffect(() => {
    if (!libraries || bars.length === 0) {
      return;
    }
    
    const { Map: GoogleMap } = libraries[MAPS_LIBRARY];
    mapRef.current = new GoogleMap(mapNodeRef.current, {
      mapId: 'DEMO_MAP_ID',
      center: MAP_CENTER,
      zoom: 7,
    });
    
    const { AdvancedMarkerElement: Marker } = libraries[MARKER_LIBRARY];
    
    // Create markers based on bar coordinates
    const infowindow = new google.maps.InfoWindow(); // Create an InfoWindow instance
    const markers = bars.map((bar) => {
      const marker = new Marker({
        position: { lat: bar.latitude, lng: bar.longitude },
      });

      // Set up an InfoWindow for each marker
      marker.addListener('click', () => {
        infowindow.setContent(`
          <div style="font-family: Arial, sans-serif; color: black; width: 200px;">
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">
              ${bar.name}
            </div>
            <button style="margin-top: 8px; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;"
                    onclick="location.href='/bars/${bar.id}/events'">
              Ver Bar
            </button>
          </div>
        `); // Set the content with black text and styled layout
        infowindow.open(mapRef.current, marker);
      });

      return marker;
    });
    
    markerCluster.current = new MarkerClusterer({
      map: mapRef.current,
      markers,
    });
  }, [libraries, bars]);
  
  if (!libraries) {
    return <h1>Cargando...</h1>;
  }
  
  return <div ref={mapNodeRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default Map;
