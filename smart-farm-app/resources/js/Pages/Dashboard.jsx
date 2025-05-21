import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Icons
const FarmIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ChevronIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const StatusPill = ({ status }) => {
  const statusClasses = {
    normal: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    alert: 'bg-red-100 text-red-800 border border-red-200'
  };
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${statusClasses[status]}`}>
      {status}
    </span>
  );
};

const SensorValue = ({ sensor }) => {
  const value = sensor.latest_measure?.value || '--';
  const unit = sensor.type === 'temperature' ? '°C' : '%';
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-semibold">{value}{unit}</span>
      <StatusPill status={getSensorStatus(sensor)} />
    </div>
  );
};

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
  const [farms, setFarms] = useState(initialFarms ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedFarm, setExpandedFarm] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Update time every second
 

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

  useEffect(() => {
    fetchLatestData();
    const dataInterval = setInterval(fetchLatestData, 3600000);
    return () => clearInterval(dataInterval);
  }, []);

  // Custom map icons
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });

  // Count alerts across all farms
  const alertCount = farms.reduce((count, farm) => {
    return count + farm.zones.reduce((zoneCount, zone) => {
      return zoneCount + zone.sensors.filter(sensor => {
        const status = getSensorStatus(sensor);
        return status === 'alert' || status === 'warning';
      }).length;
    }, 0);
  }, 0);

  return (
    <>
      <Head title="Farm Dashboard" />
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
              <div className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-green-100">
                <h1 className="text-2xl font-bold text-green-800">Farm Dashboard</h1>
                <div className="flex items-center gap-4">
                  {alertCount > 0 && (
                    <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                      <AlertIcon className="text-red-600" />
                      <span className="font-medium text-red-800">
                        {alertCount} alert{alertCount !== 1 ? 's' : ''} detected
                      </span>
                    </div>
                  )}
                </div>
              </div>
            }
          >
            <div className="p-6 overflow-y-auto">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  className={`py-2 px-4 font-medium text-sm ${activeTab === 'overview' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`py-2 px-4 font-medium text-sm ${activeTab === 'map' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('map')}
                >
                  Map View
                </button>
              </div>

              {isLoading && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center border border-green-100">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading latest farm data...
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-100">
                  {error}
                </div>
              )}

              {activeTab === 'overview' ? (
                <div className="space-y-4">
                  {farms.map(farm => {
                    const farmAlerts = farm.zones.reduce((count, zone) => {
                      return count + zone.sensors.filter(sensor => {
                        const status = getSensorStatus(sensor);
                        return status === 'alert' || status === 'warning';
                      }).length;
                    }, 0);

                    return (
                      <div key={farm.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-50 hover:shadow-md transition-shadow">
                        <div 
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-green-50 transition-colors"
                          onClick={() => setExpandedFarm(expandedFarm === farm.id ? null : farm.id)}
                        >
                          <div className="flex items-center">
                            <FarmIcon className="w-6 h-6 text-green-500 mr-3" />
                            <h2 className="text-lg font-semibold text-green-800">{farm.name}</h2>
                            {farmAlerts > 0 && (
                              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                {farmAlerts} alert{farmAlerts !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          <ChevronIcon 
                            className={`w-5 h-5 text-green-500 transform transition-transform ${
                              expandedFarm === farm.id ? 'rotate-180' : ''
                            }`}
                          />
                        </div>

                        {expandedFarm === farm.id && (
                          <div className="border-t border-green-100 p-4 bg-green-50 bg-opacity-30">
                            {farm.zones.map(zone => {
                              const zoneAlerts = zone.sensors.filter(sensor => {
                                const status = getSensorStatus(sensor);
                                return status === 'alert' || status === 'warning';
                              });

                              if (zoneAlerts.length === 0) return null;

                              return (
                                <div key={zone.id} className="mb-4 last:mb-0">
                                  <h3 className="font-medium mb-2 text-green-700">{zone.name}</h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {zone.sensors
                                      .filter(sensor => {
                                        const status = getSensorStatus(sensor);
                                        return status === 'alert' || status === 'warning';
                                      })
                                      .map(sensor => (
                                        <div key={sensor.id} className="bg-white p-3 rounded-lg border border-gray-100 hover:border-green-200 transition-colors">
                                          <div className="flex justify-between items-center">
                                            <span className="capitalize font-medium text-gray-700">{sensor.type}</span>
                                            <SensorValue sensor={sensor} />
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4 border border-green-100">
                  <MapContainer
                    center={[35.6895, 139.6917]}
                    zoom={12}
                    className="h-96 w-full rounded-lg border border-green-100"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {farms.flatMap(farm => 
                      farm.zones.map(zone => {
                        if (!zone.location) return null;
                        
                        const hasAlerts = zone.sensors.some(sensor => {
                          const status = getSensorStatus(sensor);
                          return status === 'alert' || status === 'warning';
                        });
                        
                        return (
                          <Marker 
                            key={zone.id} 
                            position={zone.location}
                            icon={hasAlerts ? 
                              new L.Icon({
                                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                                iconSize: [25, 41],
                                iconAnchor: [12, 41]
                              }) : 
                              new L.Icon({
                                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                                iconSize: [25, 41],
                                iconAnchor: [12, 41]
                              })
                            }
                          >
                            <Popup className="custom-popup">
                              <div className="space-y-2">
                                <h4 className="font-bold text-green-800">{zone.name}</h4>
                                <p className="text-sm text-gray-600">{farm.name}</p>
                                {zone.sensors
                                  .filter(sensor => {
                                    const status = getSensorStatus(sensor);
                                    return status === 'alert' || status === 'warning';
                                  })
                                  .map(sensor => (
                                    <div key={sensor.id} className="mt-2 p-2 bg-red-50 rounded border border-red-100">
                                      <div className="flex justify-between">
                                        <span className="capitalize font-medium text-red-800">{sensor.type}</span>
                                        <SensorValue sensor={sensor} />
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </Popup>
                          </Marker>
                        );
                      })
                    )}
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