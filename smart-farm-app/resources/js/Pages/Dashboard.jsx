import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import dashboardData from '@/fake-api/dashboardData';
import React, { useEffect, useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [weather, setWeather] = useState(null);
    const farmPosition = [35.6895, 139.6917];

    useEffect(() => {
        setTimeout(() => setData(dashboardData), 500);
    }, []);
    useEffect(() => {
        fetch("https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=10.1&current=temperature_2m,relative_humidity_2m&timezone=auto")
            .then((res) => res.json())
            .then((data) => {
                if (data && data.current) {
                    setWeather({
                        temperature: data.current.temperature_2m,
                        humidity: data.current.relative_humidity_2m,
                    });
                }
            });
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
                {/* Sidebar - Overlay style */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
                
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main content area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <AuthenticatedLayout
                        header={
                            <div className="flex items-center justify-between">
                                <button
                                    className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                >
                                    
                                </button>
                                <div className="flex items-center justify-between w-full">
                                <h2 className="text-xl font-semibold text-gray-800">Farm Dashboard</h2>
                                 {weather && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
                                    <span>🌡️ {weather.temperature}°C</span>
                                    <span>💧 {weather.humidity}%</span>
                                    </div>
                                )}
                                </div>

                                <div className="w-6"></div> {/* Spacer for alignment */}
                            </div>
                        }
                    >
                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.map(farm => (
                                    <div key={farm.id} className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow border border-gray-100">
                                        <div className="flex items-center mb-4">
                                            <div className="p-3 rounded-lg bg-green-50 mr-3">
                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                </svg>
                                            </div>
                                            <h2 className="text-lg font-semibold text-gray-800">{farm.name}</h2>
                                        </div>
                                        {farm.zones.map(zone => (
                                            <div key={zone.id} className="mb-4">
                                                <div className="flex items-center mb-2">
                                                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <h3 className="text-sm font-medium text-gray-700">Zone: {zone.name}</h3>
                                                </div>
                                                <div className="space-y-2">
                                                    {zone.sensors.map(sensor => (
                                                        <div key={sensor.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                                                            <div className="flex items-center">
                                                                <div className="p-2 rounded-md bg-white shadow-xs mr-3">
                                                                    {sensor.type === 'temperature' && (
                                                                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                                        </svg>
                                                                    )}
                                                                    {sensor.type === 'humidity' && (
                                                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                                        </svg>
                                                                    )}
                                                                    {sensor.type === 'soil_moisture' && (
                                                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500">{sensor.type.replace('_', ' ')}</p>
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {sensor.latest_measure?.value ?? '--'} 
                                                                        {sensor.type === 'temperature' ? '°C' : sensor.type === 'humidity' ? '%' : '%'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs text-gray-500">
                                                                    {sensor.latest_measure?.created_at ?? '--'}
                                                                </p>
                                                                <div className={`h-1 w-6 rounded-full mt-1 ${
                                                                    sensor.latest_measure?.value > (sensor.type === 'temperature' ? 30 : sensor.type === 'humidity' ? 70 : 50) 
                                                                        ? 'bg-red-500' 
                                                                        : sensor.latest_measure?.value < (sensor.type === 'temperature' ? 15 : sensor.type === 'humidity' ? 30 : 30) 
                                                                            ? 'bg-yellow-500' 
                                                                            : 'bg-green-500'
                                                                }`} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <MapContainer
  center={farmPosition}
  zoom={16}
  scrollWheelZoom={false}
  className="h-96 w-full rounded-md mt-6 shadow-md"
>
  <TileLayer
    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
  />
  <Marker position={farmPosition}>
    <Popup>Farm Location</Popup>
  </Marker>
</MapContainer>
                        </div>
                    </AuthenticatedLayout>
                </div>
            </div>
        </>
    );
}