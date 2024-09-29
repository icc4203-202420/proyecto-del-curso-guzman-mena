import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
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

// Function to generate markers
const generateMarkers = (cities, libraries, map) => {
  const { AdvancedMarkerElement: Marker } = libraries[MARKER_LIBRARY];
  return cities.map(({ name, latitude, longitude, id }) => {
    const marker = new Marker({
      position: { lat: latitude, lng: longitude },
      map,
    });

    const infowindow = new google.maps.InfoWindow();
    
    marker.addListener('click', () => {
      infowindow.setContent(`
        <div style="font-family: Arial, sans-serif; color: black; width: 200px;">
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">
            ${name}
          </div>
          <button style="margin-top: 8px; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;"
                  onclick="window.location.href='/bars/${id}/events'">
            Ver Bar
          </button>
        </div>
      `);
      infowindow.open(map, marker);
    });

    return marker;
  });
};

// Map Component
const MAP_CENTER = { lat: -33.4039996, lng: -70.5074689 };

const Map = () => {
  const libraries = useLoadGMapsLibraries();
  const markerCluster = useRef();
  const mapNodeRef = useRef();
  const mapRef = useRef();
  const inputNodeRef = useRef();
  const geocoderRef = useRef();

  // State for bars, cities, and filtered cities
  const [bars, setBars] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    // Fetch bars from the API
    const fetchBars = async () => {
      try {
        const response = await axios.get('/api/v1/bars');
        const barsData = response.data.bars;
        setBars(barsData);
        setCities(barsData); // Assuming bars data contains city information
        setFilteredCities(barsData); // Initially all cities are shown

        // Log the cities data to the console
        console.log('Ciudades cargadas:', barsData);
      } catch (error) {
        console.error('Error fetching bars:', error);
      }
    };
    fetchBars();
  }, []);

  useEffect(() => {
    if (!libraries || !mapNodeRef.current) {
      return;
    }
  
    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(mapNodeRef.current, {
        center: MAP_CENTER,
        zoom: 7,
        mapId: 'YOUR_MAP_ID', // Asegúrate de reemplazar esto con tu Map ID si es necesario
      });
    }

    // Initialize the Geocoder
    if (!geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder();
    }
  
    // Clear previous markers
    if (markerCluster.current) {
      markerCluster.current.clearMarkers();
    }
  
    // Generate and cluster new markers
    const markers = generateMarkers(filteredCities, libraries, mapRef.current);
    markerCluster.current = new MarkerClusterer(mapRef.current, markers);
  }, [filteredCities, libraries]);

  const handleSearch = (event) => {
    if (event.key !== 'Enter') return;

    const query = inputNodeRef.current.value;
    console.log('Busqueda:', query); // Verifica el término de búsqueda

    // Geocode the address to lat/lng
    geocoderRef.current.geocode({ address: query }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        console.log('Coordenadas geocodificadas:', lat(), lng());

        // Pan to the new location
        mapRef.current.setCenter({ lat: lat(), lng: lng() });

        // Filter cities based on the new center location
        const filtered = cities.filter(city =>
          city.latitude === lat() && city.longitude === lng()
        );

        console.log('Ciudades filtradas:', filtered);

        if (filtered.length > 0) {
          setFilteredCities(filtered);
        } else {
          console.log('No se encontraron coincidencias.');
        }
      } else {
        console.error('Geocode was not successful for the following reason:', status);
      }
    });
  };

  // Function to filter the cities as the user types
  const handleFilter = (event) => {
    const inputValue = event.target.value.toLowerCase();

    // Filter the cities based on input value
    const filtered = cities.filter(city =>
      city.name.toLowerCase().includes(inputValue)
    );

    console.log('Ciudades filtradas:', filtered); // Verifica las ciudades filtradas

    setFilteredCities(filtered);
  };

  if (!libraries) {
    return <h1>Cargando...</h1>;
  }

  return (
    <>
      <input
        ref={inputNodeRef}
        type="text"
        placeholder="Buscar dirección, calle, ciudad o número"
        onKeyDown={handleSearch} // Trigger search on Enter
        onChange={handleFilter} // Filter cities as user types
      />
      <div ref={mapNodeRef} style={{ width: '100vw', height: '100vh' }} />
    </>
  );
};

export default Map;
