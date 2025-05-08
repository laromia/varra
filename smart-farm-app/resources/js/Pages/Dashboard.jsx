import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import axios from 'axios';

// Icon Components
const FarmIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const DropletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ChevronIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ThermometerIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const PlantIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

// Helper Components
const StatusCard = ({ title, value, icon, color }) => (
  <div className={`p-4 rounded-xl ${color} flex items-center justify-between`}>
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    <div className="p-2 rounded-full bg-white bg-opacity-30">
      {icon}
    </div>
  </div>
);

const SensorCard = ({ type, value, timestamp, status }) => {
  const icons = {
    temperature: <ThermometerIcon className="w-5 h-5 text-red-500" />,
    humidity: <DropletIcon className="w-5 h-5 text-blue-500" />,
    soil_moisture: <PlantIcon className="w-5 h-5 text-green-500" />
  };

  const statusColors = {
    normal: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    alert: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {icons[type] || <ActivityIcon className="w-5 h-5 text-gray-500" />}
          <span className="ml-2 text-sm capitalize">{type.replace('_', ' ')}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      <div className="mt-2">
        <p className="text-xl font-semibold">
          {value || '--'} {type === 'temperature' ? '°C' : '%'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {timestamp ? new Date(timestamp).toLocaleString() : 'No data'}
        </p>
      </div>
    </div>
  );
};

// Helper function to determine sensor status
const getSensorStatus = (sensor) => {
  const value = sensor.latest_measure?.value;
  if (!value) return 'warning';
  
  if (sensor.type === 'temperature') {
    if (value > 30 || value < 10) return 'alert';
    if (value > 25 || value < 15) return 'warning';
  } else {
    if (value > 80 || value < 20) return 'alert';
    if (value > 70 || value < 30) return 'warning';
  }
  
  return 'normal';
};

export default function Dashboard({ initialFarms, auth_user_id }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [weather, setWeather] = useState(null);
    const [farms, setFarms] = useState(initialFarms ?? []);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const farmPosition = [35.6895, 139.6917];
    const [expandedFarm, setExpandedFarm] = useState(null);
    const [expandedZone, setExpandedZone] = useState(null);

    const toggleFarm = (farmId) => {
        setExpandedFarm(expandedFarm === farmId ? null : farmId);
        setExpandedZone(null);
    };

    const toggleZone = (zoneId) => {
        setExpandedZone(expandedZone === zoneId ? null : zoneId);
    };

    const fetchLatestData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/dashboard-data');
            setFarms(response.data.farms);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load latest farm data');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchWeatherData = async () => {
        try {
            const response = await fetch(
                'https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=10.1&current=temperature_2m,relative_humidity_2m&timezone=auto'
            );
            const data = await response.json();
            if (data?.current) {
                setWeather({
                    temperature: data.current.temperature_2m,
                    humidity: data.current.relative_humidity_2m,
                });
            }
        } catch (err) {
            console.error('Error fetching weather:', err);
        }
    };

    useEffect(() => {
        fetchWeatherData();
        fetchLatestData();
        
        const dataInterval = setInterval(fetchLatestData, 30000);
        const weatherInterval = setInterval(fetchWeatherData, 3600000);
        
        return () => {
            clearInterval(dataInterval);
            clearInterval(weatherInterval);
        };
    }, []);

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
    });

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-screen bg-gray-50">
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="flex-1 flex flex-col overflow-auto">
                    <AuthenticatedLayout
                        header={
                            <div className="flex items-center justify-between p-4 bg-white shadow-sm">
                                <h1 className="text-2xl font-bold text-gray-800">Farm Monitoring</h1>
                                {weather && (
                                    <div className="flex items-center gap-4 bg-blue-50 px-4 py-2 rounded-lg">
                                        <span className="flex items-center gap-1">
                                            <SunIcon />
                                            {weather.temperature}°C
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DropletIcon />
                                            {weather.humidity}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        }
                    >
                        <div className="p-6 overflow-y-auto">
                            {isLoading && (
                                <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading latest farm data...
                                </div>
                            )}

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <StatusCard 
                                    title="Total Farms" 
                                    value={farms.length} 
                                    icon={<FarmIcon />}
                                    color="bg-green-100 text-green-800"
                                />
                                <StatusCard 
                                    title="Active Zones" 
                                    value={farms.reduce((sum, farm) => sum + farm.zones.length, 0)} 
                                    icon={<MapIcon />}
                                    color="bg-blue-100 text-blue-800"
                                />
                                <StatusCard 
                                    title="Sensors Online" 
                                    value={farms.reduce((sum, farm) => sum + farm.zones.reduce((zSum, zone) => zSum + zone.sensors.length, 0), 0)} 
                                    icon={<ActivityIcon />}
                                    color="bg-purple-100 text-purple-800"
                                />
                                <StatusCard 
                                    title="Alerts" 
                                    value={farms.reduce((sum, farm) => {
                                        return sum + farm.zones.reduce((zSum, zone) => {
                                            return zSum + zone.sensors.filter(sensor => {
                                                const status = getSensorStatus(sensor);
                                                return status === 'alert' || status === 'warning';
                                            }).length;
                                        }, 0);
                                    }, 0)}
                                    icon={<AlertIcon />}
                                    color="bg-red-100 text-red-800"
                                />
                            </div>

                            <div className="space-y-4">
                                {farms.map(farm => (
                                    <div key={farm.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                        <div 
                                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                                            onClick={() => toggleFarm(farm.id)}
                                        >
                                            <div className="flex items-center">
                                                <FarmIcon className="w-6 h-6 text-green-500 mr-3" />
                                                <h2 className="text-lg font-semibold">{farm.name}</h2>
                                                <span className="ml-2 text-sm text-gray-500">
                                                    ({farm.zones.length} zones)
                                                </span>
                                            </div>
                                            <ChevronIcon 
                                                className={`w-5 h-5 transform transition-transform ${
                                                    expandedFarm === farm.id ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </div>

                                        {expandedFarm === farm.id && (
                                            <div className="border-t border-gray-100 p-4">
                                                {farm.zones.map(zone => (
                                                    <div key={zone.id} className="mb-4 last:mb-0">
                                                        <div 
                                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer"
                                                            onClick={() => toggleZone(zone.id)}
                                                        >
                                                            <div 
    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer"
    onClick={() => toggleZone(zone.id)}
>
    <div className="flex items-center flex-wrap gap-2">
        <h3 className="font-medium">{zone.name}</h3>
        
        {/* Plant types display */}
        {zone.plant_types?.length > 0 ? (
            zone.plant_types.map((plant) => (
                <span 
                    key={plant.id}
                    className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                >
                    {plant.name}
                </span>
            ))
        ) : (
            <span className="text-xs text-gray-500">No plants</span>
        )}
        
        {/* Plant count - only show if there are plants */}
        {zone.plantTypes?.length > 0 && (
            <span className="ml-2 text-xs text-gray-500">
                ({zone.plantTypes.length} plants)
            </span>
        )}
    </div>
    
    {/* Chevron icon */}
    <ChevronIcon 
        className={`w-4 h-4 transform transition-transform ${
            expandedZone === zone.id ? 'rotate-180' : ''
        }`}
    />
</div>
                                                            <ChevronIcon 
                                                                className={`w-4 h-4 transform transition-transform ${
                                                                    expandedZone === zone.id ? 'rotate-180' : ''
                                                                }`}
                                                            />
                                                        </div>

                                                        {expandedZone === zone.id && (
                                                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-2">
                                                                {zone.sensors.map(sensor => (
                                                                    <SensorCard 
                                                                        key={sensor.id}
                                                                        type={sensor.type}
                                                                        value={sensor.latest_measure?.value}
                                                                        timestamp={sensor.latest_measure?.created_at}
                                                                        status={getSensorStatus(sensor)}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {expandedFarm && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-3">Farm Location</h3>
                                    <MapContainer
                                        center={farmPosition}
                                        zoom={14}
                                        className="h-64 w-full rounded-lg shadow-md border border-gray-200"
                                    >
                                        <TileLayer
                                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                        />
                                        <Marker position={farmPosition}>
                                            <Popup>
                                                {farms.find(f => f.id === expandedFarm)?.name}
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>
                            )}
                        </div>
                    </AuthenticatedLayout>
                </div>
            </div>
        </>
    );
}