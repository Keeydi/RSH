import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  Linking,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import * as Location from 'expo-location';
import {theme} from '../config/theme';

const {width, height} = Dimensions.get('window');

// Rizal High School - Exact Google Maps location
const SCHOOL_ADDRESS = {
  name: 'Rizal High School',
  address: 'H39G+94H, Dr. Sixto Antonio Ave., Pasig, 1600 Metro Manila',
  lat: 14.5683, // Rizal High School exact coordinates (Main Entrance)
  lng: 121.0753,
};

// School map coordinates (using the school address)
const SCHOOL_CENTER = {
  lat: SCHOOL_ADDRESS.lat,
  lng: SCHOOL_ADDRESS.lng,
};

// School campus bounds - Extended to show more area with legends (±0.01 degrees ≈ 1km radius)
const SCHOOL_CAMPUS_BOUNDS = [
  [14.5583, 121.0653], // Southwest corner (extended)
  [14.5783, 121.0853], // Northeast corner (extended)
];

// Helper function to check if a coordinate is within school campus bounds
const isWithinCampusBounds = (lat: number, lng: number): boolean => {
  const [sw, ne] = SCHOOL_CAMPUS_BOUNDS;
  return lat >= sw[0] && lat <= ne[0] && lng >= sw[1] && lng <= ne[1];
};

// Helper function to clip coordinates to campus bounds
const clipToBounds = (lat: number, lng: number): MapPoint => {
  const [sw, ne] = SCHOOL_CAMPUS_BOUNDS;
  return {
    lat: Math.max(sw[0], Math.min(ne[0], lat)),
    lng: Math.max(sw[1], Math.min(ne[1], lng)),
  };
};

interface MapPoint {
  lat: number;
  lng: number;
}

interface Building {
  id: string;
  name: string;
  coordinate: MapPoint;
  type: 'building';
}

interface SafeZone {
  id: string;
  name: string;
  coordinates: MapPoint[];
  type: 'safe';
}

interface DangerArea {
  id: string;
  name: string;
  coordinates: MapPoint[];
  type: 'danger';
}

interface EvacuationRoute {
  id: string;
  from: string;
  to: string;
  coordinates: MapPoint[];
}

interface RelocationSite {
  id: string;
  name: string;
  coordinate: MapPoint;
  address: string;
  capacity?: string;
  type: 'relocation';
}

interface SchoolFacility {
  id: string;
  name: string;
  coordinate: MapPoint;
  icon: string;
  color: string;
  category: 'entrance' | 'building' | 'facility' | 'sports' | 'emergency';
}

const MapScreen = () => {
  const [location, setLocation] = useState<MapPoint | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  // Removed: showRelocationSites state - no relocation sites outside school campus
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [isLegendVisible, setIsLegendVisible] = useState(true);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationEnabled(true);
        getCurrentLocation();
      } else {
        Alert.alert(
          'Location Permission',
          'Location permission is needed to show your position on the map.'
        );
      }
    } catch (error) {
      console.error('Error requesting location:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const newLocation = {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      };
      setLocation(newLocation);
      // Update map with user location
      if (webViewRef.current) {
        webViewRef.current.postMessage(
          JSON.stringify({
            type: 'updateLocation',
            location: newLocation,
          })
        );
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  // Rizal High School buildings and facilities - Filtered to campus bounds only
  const buildings: Building[] = [
    {
      id: '1',
      name: 'Main Building',
      coordinate: {
        lat: SCHOOL_CENTER.lat + 0.002,
        lng: SCHOOL_CENTER.lng - 0.001,
      },
      type: 'building',
    },
    {
      id: '2',
      name: 'Gymnasium & Sports Facilities',
      coordinate: {
        lat: SCHOOL_CENTER.lat - 0.001,
        lng: SCHOOL_CENTER.lng + 0.002,
      },
      type: 'building',
    },
    {
      id: '3',
      name: 'Library',
      coordinate: {
        lat: SCHOOL_CENTER.lat + 0.001,
        lng: SCHOOL_CENTER.lng + 0.001,
      },
      type: 'building',
    },
    {
      id: '4',
      name: 'Canteen',
      coordinate: {
        lat: SCHOOL_CENTER.lat - 0.002,
        lng: SCHOOL_CENTER.lng - 0.001,
      },
      type: 'building',
    },
    {
      id: '5',
      name: 'Computer Rooms',
      coordinate: {
        lat: SCHOOL_CENTER.lat + 0.0015,
        lng: SCHOOL_CENTER.lng - 0.0005,
      },
      type: 'building',
    },
    {
      id: '6',
      name: 'Administrative Offices',
      coordinate: {
        lat: SCHOOL_CENTER.lat - 0.0005,
        lng: SCHOOL_CENTER.lng - 0.0015,
      },
      type: 'building',
    },
  ].filter(building => 
    isWithinCampusBounds(building.coordinate.lat, building.coordinate.lng)
  ).map(building => ({
    ...building,
    coordinate: clipToBounds(building.coordinate.lat, building.coordinate.lng),
  }));

  // Rizal High School campus facilities with specific icons - Filtered to campus bounds only
  const schoolFacilities: SchoolFacility[] = [
    {
      id: 'entrance1',
      name: 'Main Entrance',
      coordinate: {
        lat: SCHOOL_CENTER.lat,
        lng: SCHOOL_CENTER.lng - 0.0008,
      },
      icon: '🚪',
      color: '#10B981',
      category: 'entrance',
    },
    {
      id: 'oval1',
      name: 'Rizal High School Oval / Sports Field',
      coordinate: {
        lat: SCHOOL_CENTER.lat + 0.0025,
        lng: SCHOOL_CENTER.lng + 0.0025,
      },
      icon: '🏃',
      color: '#22C55E',
      category: 'sports',
    },
    {
      id: 'emergency1',
      name: 'Emergency Exit 1',
      coordinate: {
        lat: SCHOOL_CENTER.lat - 0.0015,
        lng: SCHOOL_CENTER.lng + 0.0015,
      },
      icon: '🚨',
      color: '#EF4444',
      category: 'emergency',
    },
    {
      id: 'emergency2',
      name: 'Emergency Exit 2',
      coordinate: {
        lat: SCHOOL_CENTER.lat + 0.002,
        lng: SCHOOL_CENTER.lng - 0.0015,
      },
      icon: '🚨',
      color: '#EF4444',
      category: 'emergency',
    },
    {
      id: 'heritage1',
      name: 'Heritage Trees',
      coordinate: {
        lat: SCHOOL_CENTER.lat + 0.001,
        lng: SCHOOL_CENTER.lng + 0.002,
      },
      icon: '🌳',
      color: '#10B981',
      category: 'facility',
    },
    {
      id: 'canteen1',
      name: 'School Canteen',
      coordinate: {
        lat: SCHOOL_CENTER.lat - 0.002,
        lng: SCHOOL_CENTER.lng - 0.001,
      },
      icon: '🍽️',
      color: '#F59E0B',
      category: 'facility',
    },
    {
      id: 'library1',
      name: 'Library',
      coordinate: {
        lat: SCHOOL_CENTER.lat + 0.001,
        lng: SCHOOL_CENTER.lng + 0.001,
      },
      icon: '📚',
      color: '#3B82F6',
      category: 'facility',
    },
    {
      id: 'gym1',
      name: 'Gymnasium',
      coordinate: {
        lat: SCHOOL_CENTER.lat - 0.001,
        lng: SCHOOL_CENTER.lng + 0.002,
      },
      icon: '🏀',
      color: '#8B5CF6',
      category: 'sports',
    },
    {
      id: 'admin1',
      name: 'Administrative Office',
      coordinate: {
        lat: SCHOOL_CENTER.lat - 0.0005,
        lng: SCHOOL_CENTER.lng - 0.0015,
      },
      icon: '🏢',
      color: '#6366F1',
      category: 'building',
    },
    {
      id: 'parking1',
      name: 'Parking Area',
      coordinate: {
        lat: SCHOOL_CENTER.lat - 0.003,
        lng: SCHOOL_CENTER.lng - 0.002,
      },
      icon: '🅿️',
      color: '#6B7280',
      category: 'facility',
    },
    {
      id: 'gate2',
      name: 'Side Gate',
      coordinate: {
        lat: SCHOOL_CENTER.lat + 0.0015,
        lng: SCHOOL_CENTER.lng - 0.001,
      },
      icon: '🚪',
      color: '#10B981',
      category: 'entrance',
    },
    {
      id: 'playground1',
      name: 'Playground',
      coordinate: {
        lat: SCHOOL_CENTER.lat - 0.0015,
        lng: SCHOOL_CENTER.lng + 0.003,
      },
      icon: '🎮',
      color: '#22C55E',
      category: 'sports',
    },
    {
      id: 'med1',
      name: 'Medical Clinic',
      coordinate: {
        lat: SCHOOL_CENTER.lat + 0.0005,
        lng: SCHOOL_CENTER.lng - 0.0005,
      },
      icon: '🏥',
      color: '#EF4444',
      category: 'facility',
    },
    {
      id: 'lab1',
      name: 'Science Laboratory',
      coordinate: {
        lat: SCHOOL_CENTER.lat + 0.0025,
        lng: SCHOOL_CENTER.lng - 0.0005,
      },
      icon: '🔬',
      color: '#8B5CF6',
      category: 'facility',
    },
  ].filter(facility => 
    isWithinCampusBounds(facility.coordinate.lat, facility.coordinate.lng)
  ).map(facility => ({
    ...facility,
    coordinate: clipToBounds(facility.coordinate.lat, facility.coordinate.lng),
  }));

  // Safe zones - Positioned accurately to match actual locations
  // School center: lat 14.5683, lng 121.0753
  // Campus bounds: SW [14.5583, 121.0653] to NE [14.5783, 121.0853] (extended)
  const safeZones: SafeZone[] = [
    {
      id: 'sz1',
      name: 'Main Field / Sports Oval',
      // Positioned to match the oval facility marker at lat +0.0025, lng +0.0025
      // Creating an oval-shaped polygon (circular approximation with 8 points)
      coordinates: [
        {
          lat: SCHOOL_CENTER.lat + 0.0025,
          lng: SCHOOL_CENTER.lng + 0.0025 + 0.0015, // East
        },
        {
          lat: SCHOOL_CENTER.lat + 0.0025 + 0.001,
          lng: SCHOOL_CENTER.lng + 0.0025 + 0.001, // Northeast
        },
        {
          lat: SCHOOL_CENTER.lat + 0.0025 + 0.0015,
          lng: SCHOOL_CENTER.lng + 0.0025, // North
        },
        {
          lat: SCHOOL_CENTER.lat + 0.0025 + 0.001,
          lng: SCHOOL_CENTER.lng + 0.0025 - 0.001, // Northwest
        },
        {
          lat: SCHOOL_CENTER.lat + 0.0025,
          lng: SCHOOL_CENTER.lng + 0.0025 - 0.0015, // West
        },
        {
          lat: SCHOOL_CENTER.lat + 0.0025 - 0.001,
          lng: SCHOOL_CENTER.lng + 0.0025 - 0.001, // Southwest
        },
        {
          lat: SCHOOL_CENTER.lat + 0.0025 - 0.0015,
          lng: SCHOOL_CENTER.lng + 0.0025, // South
        },
        {
          lat: SCHOOL_CENTER.lat + 0.0025 - 0.001,
          lng: SCHOOL_CENTER.lng + 0.0025 + 0.001, // Southeast
        },
      ],
      type: 'safe',
    },
    {
      id: 'sz2',
      name: 'Front Courtyard / Open Area',
      coordinates: [
        {
          lat: SCHOOL_CENTER.lat - 0.0008,
          lng: SCHOOL_CENTER.lng - 0.0008,
        },
        {
          lat: SCHOOL_CENTER.lat - 0.0003,
          lng: SCHOOL_CENTER.lng - 0.0008,
        },
        {
          lat: SCHOOL_CENTER.lat - 0.0003,
          lng: SCHOOL_CENTER.lng - 0.0003,
        },
        {
          lat: SCHOOL_CENTER.lat - 0.0008,
          lng: SCHOOL_CENTER.lng - 0.0003,
        },
      ],
      type: 'safe',
    },
    {
      id: 'sz3',
      name: 'Side Open Grounds',
      coordinates: [
        {
          lat: SCHOOL_CENTER.lat + 0.0005,
          lng: SCHOOL_CENTER.lng + 0.0005,
        },
        {
          lat: SCHOOL_CENTER.lat + 0.001,
          lng: SCHOOL_CENTER.lng + 0.0005,
        },
        {
          lat: SCHOOL_CENTER.lat + 0.001,
          lng: SCHOOL_CENTER.lng + 0.001,
        },
        {
          lat: SCHOOL_CENTER.lat + 0.0005,
          lng: SCHOOL_CENTER.lng + 0.001,
        },
      ],
      type: 'safe',
    },
    {
      id: 'sz4',
      name: 'Back Open Space',
      coordinates: [
        {
          lat: SCHOOL_CENTER.lat - 0.001,
          lng: SCHOOL_CENTER.lng + 0.0005,
        },
        {
          lat: SCHOOL_CENTER.lat - 0.0005,
          lng: SCHOOL_CENTER.lng + 0.0005,
        },
        {
          lat: SCHOOL_CENTER.lat - 0.0005,
          lng: SCHOOL_CENTER.lng + 0.001,
        },
        {
          lat: SCHOOL_CENTER.lat - 0.001,
          lng: SCHOOL_CENTER.lng + 0.001,
        },
      ],
      type: 'safe',
    },
    {
      id: 'sz5',
      name: 'Central Courtyard',
      coordinates: [
        {
          lat: SCHOOL_CENTER.lat - 0.0004,
          lng: SCHOOL_CENTER.lng + 0.0003,
        },
        {
          lat: SCHOOL_CENTER.lat + 0.0004,
          lng: SCHOOL_CENTER.lng + 0.0003,
        },
        {
          lat: SCHOOL_CENTER.lat + 0.0004,
          lng: SCHOOL_CENTER.lng + 0.0008,
        },
        {
          lat: SCHOOL_CENTER.lat - 0.0004,
          lng: SCHOOL_CENTER.lng + 0.0008,
        },
      ],
      type: 'safe',
    },
  ].map(zone => {
    // Ensure all coordinates are within bounds and clip if necessary
    const clippedCoords = zone.coordinates.map(coord => {
      const clipped = clipToBounds(coord.lat, coord.lng);
      // Double-check bounds
      if (!isWithinCampusBounds(clipped.lat, clipped.lng)) {
        // If still outside, use school center as fallback
        return SCHOOL_CENTER;
      }
      return clipped;
    }).filter(coord => isWithinCampusBounds(coord.lat, coord.lng));
    
    return {
      ...zone,
      coordinates: clippedCoords,
    };
  }).filter(zone => zone.coordinates.length >= 3); // Keep only zones with at least 3 valid points

  // Danger areas - Filtered and clipped to campus bounds only
  const dangerAreas: DangerArea[] = [
    {
      id: 'da1',
      name: 'Science Laboratories',
      coordinates: [
        {
          lat: SCHOOL_CENTER.lat + 0.0025,
          lng: SCHOOL_CENTER.lng - 0.0005,
        },
        {
          lat: SCHOOL_CENTER.lat + 0.003,
          lng: SCHOOL_CENTER.lng - 0.0005,
        },
        {
          lat: SCHOOL_CENTER.lat + 0.003,
          lng: SCHOOL_CENTER.lng,
        },
        {
          lat: SCHOOL_CENTER.lat + 0.0025,
          lng: SCHOOL_CENTER.lng,
        },
      ],
      type: 'danger',
    },
  ].map(area => ({
    ...area,
    coordinates: area.coordinates
      .map(coord => clipToBounds(coord.lat, coord.lng))
      .filter(coord => isWithinCampusBounds(coord.lat, coord.lng)),
  })).filter(area => area.coordinates.length >= 3); // Keep only areas with at least 3 valid points

  // Evacuation routes - Filtered and clipped to campus bounds only
  const evacuationRoutes: EvacuationRoute[] = [
    {
      id: 'r1',
      from: '1',
      to: 'sz1',
      coordinates: [
        buildings[0].coordinate,
        {
          lat: SCHOOL_CENTER.lat + 0.0025,
          lng: SCHOOL_CENTER.lng + 0.001,
        },
        safeZones[0].coordinates[0],
      ],
    },
    {
      id: 'r2',
      from: '2',
      to: 'sz1',
      coordinates: [
        buildings[1].coordinate,
        {
          lat: SCHOOL_CENTER.lat + 0.001,
          lng: SCHOOL_CENTER.lng + 0.0025,
        },
        safeZones[0]?.coordinates[0] || SCHOOL_CENTER,
      ],
    },
  ].map(route => ({
    ...route,
    coordinates: route.coordinates
      .map(coord => clipToBounds(coord.lat, coord.lng))
      .filter(coord => isWithinCampusBounds(coord.lat, coord.lng)),
  })).filter(route => route.coordinates.length >= 2); // Keep only routes with at least 2 valid points

  // Relocation Sites - REMOVED: Focus only on school campus
  // All relocation sites outside school campus have been removed per client request
  // System now focuses exclusively on Rizal High School campus area
  const relocationSites: RelocationSite[] = [];

  // Navigate to school address
  const navigateToSchoolAddress = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      SCHOOL_ADDRESS.address
    )}`;
    Linking.openURL(url).catch(err =>
      Alert.alert('Error', 'Could not open maps application.')
    );
  };

  // Removed: navigateToRelocationSite function - no relocation sites outside school campus

  // Generate HTML with Leaflet.js
  const generateMapHTML = () => {
    const mapData = {
      center: SCHOOL_CENTER,
      buildings: buildings, // Include building markers
      safeZones, // Safe zones shown as green polygons
      dangerAreas: [], // Danger areas removed per client request
      evacuationRoutes: [], // Evacuation routes removed per client request
      relocationSites: [], // Removed: Focus on school campus only
      schoolFacilities: schoolFacilities, // Include all facility markers with icons
      schoolAddress: SCHOOL_ADDRESS,
      userLocation: location,
      safeZoneColor: theme.safe, // Pass theme color to HTML
    };

    return `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        #map { width: 100%; height: 100vh; position: absolute; top: 0; left: 0; }
        .leaflet-container { width: 100%; height: 100%; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
        try {
            const mapData = ${JSON.stringify(mapData)};
            
            // School campus bounds - Extended to show more area with legends
            const SCHOOL_BOUNDS = [[14.5583, 121.0653], [14.5783, 121.0853]];
            
            // Wait for Leaflet to load
            if (typeof L === 'undefined') {
                console.error('Leaflet library not loaded');
                document.body.innerHTML = '<div style="padding: 20px; text-align: center; color: red;">Error: Map library failed to load</div>';
            } else {
                // Initialize map - Focus on School Address
                const map = L.map('map', {
                    center: [mapData.schoolAddress.lat, mapData.schoolAddress.lng],
                    zoom: 17,
                    minZoom: 15,
                    maxZoom: 20,
                    zoomControl: true
                });
                
                // Add OpenStreetMap tiles
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 20,
                    minZoom: 15,
                    subdomains: ['a', 'b', 'c']
                }).addTo(map);
                
                // Ensure map container is visible
                map.whenReady(function() {
                    map.invalidateSize();
                    console.log('Map initialized successfully');
                });
                
                // Restrict map to school campus bounds (after tiles load)
                setTimeout(() => {
                    try {
                        map.setMaxBounds(SCHOOL_BOUNDS);
                        map.setView([mapData.schoolAddress.lat, mapData.schoolAddress.lng], 17);
                        map.invalidateSize();
                    } catch (e) {
                        console.error('Error setting bounds:', e);
                    }
                }, 1000);
                
                // Add safe zones (green polygons) - STRICT bounds checking
                mapData.safeZones.forEach(zone => {
                    // Triple-check all coordinates are within bounds
                    const [sw, ne] = SCHOOL_BOUNDS;
                    const validCoords = zone.coordinates
                        .map(c => {
                            // Clip each coordinate to bounds
                            const clippedLat = Math.max(sw[0], Math.min(ne[0], c.lat));
                            const clippedLng = Math.max(sw[1], Math.min(ne[1], c.lng));
                            return {lat: clippedLat, lng: clippedLng};
                        })
                        .filter(c => {
                            // Final validation - must be strictly within bounds
                            return c.lat >= sw[0] && c.lat <= ne[0] && 
                                   c.lng >= sw[1] && c.lng <= ne[1];
                        })
                        .map(c => [c.lat, c.lng]);
                    
                    if (validCoords.length < 3) {
                        console.warn('Safe zone skipped - not enough valid points:', zone.name);
                        return; // Skip if not enough valid points
                    }
                    
                    // Verify polygon bounds are within school bounds
                    const testPolygon = L.polygon(validCoords);
                    const polyBounds = testPolygon.getBounds();
                    const polySW = polyBounds.getSouthWest();
                    const polyNE = polyBounds.getNorthEast();
                    
                    // Check if polygon extends outside school bounds
                    if (polySW.lat < sw[0] || polyNE.lat > ne[0] || 
                        polySW.lng < sw[1] || polyNE.lng > ne[1]) {
                        console.warn('Safe zone extends outside bounds - skipping:', zone.name);
                        return;
                    }
                    
                    const polygon = L.polygon(validCoords, {
                        color: mapData.safeZoneColor,
                        fillColor: mapData.safeZoneColor,
                        fillOpacity: 0.3,
                        weight: 2
                    }).addTo(map);
                    
                    const center = polygon.getBounds().getCenter();
                    // Only add marker if center is strictly within bounds
                    if (center.lat >= sw[0] && center.lat <= ne[0] && 
                        center.lng >= sw[1] && center.lng <= ne[1]) {
                        L.marker(center, {
                            icon: L.divIcon({
                                className: 'safe-marker',
                                html: '<div style="background: ' + mapData.safeZoneColor + '; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 2px solid white; font-weight: bold;">✓</div>',
                                iconSize: [30, 30]
                            })
                        }).bindPopup(zone.name + '<br><small>Safe Zone</small>').addTo(map);
                    }
                });
                
                // Add school facility markers with icons
                if (mapData.schoolFacilities && mapData.schoolFacilities.length > 0) {
                    mapData.schoolFacilities.forEach(facility => {
                        const [sw, ne] = SCHOOL_BOUNDS;
                        if (facility.coordinate.lat >= sw[0] && facility.coordinate.lat <= ne[0] &&
                            facility.coordinate.lng >= sw[1] && facility.coordinate.lng <= ne[1]) {
                            L.marker([facility.coordinate.lat, facility.coordinate.lng], {
                                icon: L.divIcon({
                                    className: 'facility-marker',
                                    html: '<div style="background: ' + (facility.color || '#3B82F6') + '; color: white; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; border: 2px solid white; font-size: 18px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">' + (facility.icon || '📍') + '</div>',
                                    iconSize: [35, 35]
                                })
                            }).bindPopup('<b>' + facility.name + '</b><br><small>' + (facility.category || 'Facility') + '</small>').addTo(map);
                        }
                    });
                }
                
                // Add building markers
                if (mapData.buildings && mapData.buildings.length > 0) {
                    mapData.buildings.forEach(building => {
                        const [sw, ne] = SCHOOL_BOUNDS;
                        if (building.coordinate.lat >= sw[0] && building.coordinate.lat <= ne[0] &&
                            building.coordinate.lng >= sw[1] && building.coordinate.lng <= ne[1]) {
                            L.marker([building.coordinate.lat, building.coordinate.lng], {
                                icon: L.divIcon({
                                    className: 'building-marker',
                                    html: '<div style="background: #6366F1; color: white; border-radius: 4px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 2px solid white; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🏢</div>',
                                    iconSize: [30, 30]
                                })
                            }).bindPopup('<b>' + building.name + '</b><br><small>Building</small>').addTo(map);
                        }
                    });
                }
                
                // Add school marker
                if (mapData.schoolAddress) {
                    window.schoolMarker = L.marker([mapData.schoolAddress.lat, mapData.schoolAddress.lng], {
                        icon: L.divIcon({
                            className: 'school-marker',
                            html: '<div style="background: #8B5CF6; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 3px solid white; font-size: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">🏫</div>',
                            iconSize: [40, 40]
                        })
                    }).bindPopup('<b>' + mapData.schoolAddress.name + '</b><br><small>' + mapData.schoolAddress.address + '</small>').addTo(map);
                } else {
                    window.schoolMarker = null;
                }
                
                // Removed: Relocation markers - Focus on school campus only
                window.relocationMarkers = [];
                
                // Add user location if available - Only if within campus bounds
                if (mapData.userLocation) {
                    const [sw, ne] = SCHOOL_BOUNDS;
                    if (mapData.userLocation.lat >= sw[0] && mapData.userLocation.lat <= ne[0] &&
                        mapData.userLocation.lng >= sw[1] && mapData.userLocation.lng <= ne[1]) {
                        L.marker([mapData.userLocation.lat, mapData.userLocation.lng], {
                            icon: L.divIcon({
                                className: 'user-marker',
                                html: '<div style="background: #FACC15; color: #1F2937; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; border: 3px solid white; font-weight: bold; font-size: 12px;">📍</div>',
                                iconSize: [25, 25]
                            })
                        }).bindPopup('You Are Here').addTo(map);
                    }
                }
                
                // Store map reference globally
                window.map = map;
                
                // Listen for messages from React Native
                window.addEventListener('message', function(event) {
            try {
                const data = JSON.parse(event.data);
                    if (data.type === 'updateLocation' && data.location && window.map) {
                        const [sw, ne] = SCHOOL_BOUNDS;
                        // Only show user location if within campus bounds
                        if (data.location.lat >= sw[0] && data.location.lat <= ne[0] &&
                            data.location.lng >= sw[1] && data.location.lng <= ne[1]) {
                            // Update user location marker
                            if (window.userMarker) {
                                window.map.removeLayer(window.userMarker);
                            }
                            window.userMarker = L.marker([data.location.lat, data.location.lng], {
                                icon: L.divIcon({
                                    className: 'user-marker',
                                    html: '<div style="background: #FACC15; color: #1F2937; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; border: 3px solid white; font-weight: bold; font-size: 12px;">📍</div>',
                                    iconSize: [25, 25]
                                })
                            }).bindPopup('You Are Here').addTo(window.map);
                            window.map.setView([data.location.lat, data.location.lng], 17);
                        } else {
                            // User is outside campus - remove marker if exists
                            if (window.userMarker) {
                                window.map.removeLayer(window.userMarker);
                                window.userMarker = null;
                            }
                        }
                } else if (data.type === 'focusOnSchool' && window.map) {
                    // Focus on school address
                    window.map.setView([mapData.schoolAddress.lat, mapData.schoolAddress.lng], 18, {
                        animate: true,
                        duration: 0.5
                    });
                    if (window.schoolMarker) {
                        window.schoolMarker.openPopup();
                    }
                } else if (data.type === 'navigateToSchool' && window.map) {
                    // Navigate to school address
                    window.map.setView([mapData.schoolAddress.lat, mapData.schoolAddress.lng], 18);
                    if (window.schoolMarker) {
                        window.schoolMarker.openPopup();
                    }
                }
                // Removed: showRelocationSites handler - no relocation sites outside school campus
            } catch (e) {
                console.error('Error processing message:', e);
            }
        });
        
                // Send map ready message
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({type: 'mapReady'}));
                }
            }
        } catch (error) {
            console.error('Map initialization error:', error);
            document.body.innerHTML = '<div style="padding: 20px; text-align: center; color: red;">Error loading map: ' + error.message + '</div>';
        }
    </script>
</body>
</html>
    `;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header - Logo Colors */}
        <View style={{backgroundColor: theme.primary.main}} className="px-6 py-4">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold mb-1">Rizal High School</Text>
              <Text style={{color: '#FFE5D9'}} className="text-sm">Campus Map - Safe zones</Text>
            </View>
            <View style={{backgroundColor: theme.secondary.main}} className="rounded-full p-3">
              <Text className="text-white text-2xl">🏫</Text>
            </View>
          </View>
          <View className="bg-white/20 rounded-lg p-3 mt-2">
            <Text className="text-white text-sm font-semibold mb-1">📍 School Address:</Text>
            <Text className="text-white text-base font-bold">{SCHOOL_ADDRESS.address}</Text>
          </View>
        </View>

        {/* Map Container */}
        <View className="flex-1" style={{paddingBottom: isPanelCollapsed ? 60 : Dimensions.get('window').height * 0.4}}>
          <WebView
            ref={webViewRef}
            source={{html: generateMapHTML()}}
            style={styles.map}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={false}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('WebView error: ', nativeEvent);
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('WebView HTTP error: ', nativeEvent);
            }}
            onMessage={(event) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                if (data.type === 'mapReady') {
                  console.log('Map ready');
                }
              } catch (e) {
                console.error('Error parsing message:', e);
              }
            }}
            onLoadEnd={() => {
              console.log('WebView loaded');
            }}
          />

          {/* Collapsible Legend Overlay */}
          {isLegendVisible ? (
            <View style={styles.legend}>
              {/* Legend Header with Toggle */}
              <TouchableOpacity
                onPress={() => setIsLegendVisible(false)}
                style={styles.legendHeader}>
                <Text style={styles.legendTitle}>Rizal High School</Text>
                <Text style={styles.legendToggle}>✕</Text>
              </TouchableOpacity>
              
              <Text style={styles.legendSubtitle}>Campus Legend</Text>
              
              {/* Map Features - Only Safe Zones */}
              <View style={styles.legendSection}>
                <Text style={styles.legendSectionTitle}>Map Features</Text>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, {backgroundColor: theme.safe}]} />
                  <Text style={styles.legendText}>Safe Zones</Text>
                </View>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setIsLegendVisible(true)}
              style={styles.legendToggleButton}>
              <Text style={styles.legendToggleButtonText}>📋 Show Legend</Text>
            </TouchableOpacity>
          )}

          {/* Quick Actions Button - Removed relocation sites toggle (focus on school campus only) */}
        </View>

        {/* Collapsible Bottom Info Panel - tap to show/hide map information */}
        <View 
          style={[
            styles.bottomPanel,
            isPanelCollapsed && styles.bottomPanelCollapsed
          ]}>
          {/* Collapse/Expand Toggle Button */}
          <TouchableOpacity
            onPress={() => setIsPanelCollapsed(!isPanelCollapsed)}
            style={styles.collapseButton}
            activeOpacity={0.7}
            accessibilityLabel={isPanelCollapsed ? 'Show info' : 'Hide info'}
            accessibilityRole="button">
            <Text style={styles.collapseButtonText}>
              {isPanelCollapsed ? '▲ Show Info' : '▼ Hide Info'}
            </Text>
          </TouchableOpacity>

          {!isPanelCollapsed && (
            <ScrollView 
              style={[styles.panelScrollView, {minHeight: 120}]}
              contentContainerStyle={styles.panelContent}
              showsVerticalScrollIndicator={true}
              bounces={false}>
              {/* Relocation Sites Info - Removed: Focus on school campus only */}

              {/* Location Status */}
              <View style={styles.gpsSection}>
                <View style={styles.gpsInfo}>
                  <Text style={styles.gpsTitle}>GPS Tracking</Text>
                  <Text style={styles.gpsStatus}>
                    {locationEnabled ? 'Location enabled' : 'Location disabled'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={locationEnabled ? getCurrentLocation : requestLocationPermission}
                  style={[
                    styles.gpsButton,
                    locationEnabled ? styles.gpsButtonActive : styles.gpsButtonInactive
                  ]}>
                  <Text style={[
                    styles.gpsButtonText,
                    locationEnabled ? styles.gpsButtonTextActive : styles.gpsButtonTextInactive
                  ]}>
                    {locationEnabled ? 'Update' : 'Enable GPS'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Map Info */}
              <View style={styles.mapInfoBox}>
                <Text style={styles.mapInfoText}>
                  <Text style={{fontWeight: 'bold'}}>Rizal High School Campus Map{'\n'}</Text>
                  • Green areas: Safe zones within school campus{'\n'}
                  • Map restricted to school campus area only{'\n'}
                  • Powered by OpenStreetMap
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  legend: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    padding: 12,
    borderRadius: 10,
    minWidth: 180,
    maxWidth: 200,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#1F2937',
  },
  legendSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  legendSection: {
    marginBottom: 10,
    paddingBottom: 8,
  },
  legendSectionWithBorder: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  legendSectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
    textAlign: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 11,
    color: '#374151',
    flex: 1,
  },
  legendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendToggle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'bold',
    padding: 4,
  },
  legendToggleButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  legendToggleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  quickActions: {
    position: 'absolute',
    bottom: 200,
    right: 10,
    flexDirection: 'column',
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomPanel: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: Dimensions.get('window').height * 0.5,
    minHeight: 60,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomPanelCollapsed: {
    height: 60,
    maxHeight: 60,
  },
  collapseButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  collapseButtonText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600',
  },
  panelScrollView: {
    flex: 1,
    maxHeight: Dimensions.get('window').height * 0.45,
  },
  panelContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  relocationSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  relocationList: {
    maxHeight: 180,
  },
  relocationCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  relocationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  relocationAddress: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  relocationCapacity: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 4,
  },
  gpsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 8,
  },
  gpsInfo: {
    flex: 1,
    marginRight: 12,
  },
  gpsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  gpsStatus: {
    fontSize: 14,
    color: '#6B7280',
  },
  gpsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  gpsButtonActive: {
    backgroundColor: '#3B82F6',
  },
  gpsButtonInactive: {
    backgroundColor: '#D1D5DB',
  },
  gpsButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  gpsButtonTextActive: {
    color: '#FFFFFF',
  },
  gpsButtonTextInactive: {
    color: '#6B7280',
  },
  mapInfoBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  mapInfoText: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 16,
  },
});

export default MapScreen;
