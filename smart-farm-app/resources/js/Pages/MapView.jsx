import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head, usePage } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ArrowLeftIcon, ExclamationTriangleIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import 'leaflet/dist/leaflet.css';

// Custom marker icons with modern styling
const createCustomIcon = (status) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${
      status === 'alert' ? 'red' : status === 'warning' ? 'orange' : 'green'
    }.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [30, 46],
    iconAnchor: [15, 46],
    popupAnchor: [1, -40],
    shadowSize: [46, 46]
  });
};

export default function MapView() {
  const { farms = [], auth } = usePage().props;

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
    return 'good';
  };

  const getZoneStatus = (zone) => {
    if (!zone.sensors || zone.sensors.length === 0) return 'warning';
    return zone.sensors.reduce((status, sensor) => {
      const current = getSensorStatus(sensor);
      return current === 'alert' ? 'alert' : 
             current === 'warning' ? 'warning' : status;
    }, 'good');
  };

  const getFarmWarnings = (farm) => {
    return farm.zones?.flatMap(zone => 
      zone.sensors?.filter(sensor => {
        const status = getSensorStatus(sensor);
        return status !== 'good';
      }).map(sensor => ({
        zone: zone.name,
        sensor: sensor.type,
        value: sensor.latest_measure?.value,
        status,
        timestamp: sensor.latest_measure?.measured_at
      }))
    ) || [];
  };

  if (!farms.length) {
    return (
      <AuthenticatedLayout user={auth.user}>
        <Head title="Farm Maps" />
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
            <div className="mx-auto h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <MapPinIcon className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">No Farms Available</h3>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">
              Get started by creating your first farm to monitor your agricultural operations.
            </p>
            <div className="mt-6">
              <Link
                href="/farms/create"
                className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md transition-all"
              >
                Create New Farm
              </Link>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Farm Maps" />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Farm Field Monitoring</h1>
          </div>
          
          <Link 
            href="/dashboard" 
            className="group flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeftIcon className="w-5 h-5 text-blue-500 group-hover:text-blue-700 transition-colors" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
              Back to Dashboard
            </span>
          </Link>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium">Normal</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm font-medium">Warning</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium">Critical</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span className="text-sm font-medium">No Data</span>
          </div>
        </div>

        {/* Farm cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {farms.map(farm => {
            const farmWarnings = getFarmWarnings(farm);
            const hasZones = farm.zones?.length > 0;
            const defaultLocation = hasZones ? farm.zones[0].location : [0, 0];
            
            return (
              <div key={farm.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                {/* Farm Header */}
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{farm.name}</h2>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        {farm.location || 'Location not specified'}
                      </p>
                    </div>
                    {farmWarnings.length > 0 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {farmWarnings.length} alert{farmWarnings.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Warnings Summary */}
                {farmWarnings.length > 0 && (
                  <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Active Alerts</h3>
                    <div className="space-y-3">
                      {farmWarnings.slice(0, 3).map((warning, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-lg ${
                            warning.status === 'alert' ? 
                              'bg-gradient-to-r from-red-50 to-white border-l-4 border-red-500' :
                              'bg-gradient-to-r from-yellow-50 to-white border-l-4 border-yellow-500'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium">{warning.zone}</span>
                              <span className="text-xs text-gray-500 ml-2 capitalize">{warning.sensor.replace('_', ' ')}</span>
                            </div>
                            <span className={`font-semibold ${
                              warning.status === 'alert' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {warning.value}
                              {warning.sensor === 'temperature' ? '°C' : '%'}
                            </span>
                          </div>
                          {warning.timestamp && (
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(warning.timestamp).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      ))}
                      {farmWarnings.length > 3 && (
                        <div className="text-center text-sm text-gray-500 pt-1">
                          +{farmWarnings.length - 3} more alerts
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Map Container */}
                <div className="h-80 w-full relative">
                  {hasZones ? (
                    <MapContainer
                      center={defaultLocation}
                      zoom={14}
                      style={{ height: '100%', width: '100%', borderRadius: '0 0 12px 12px' }}
                      scrollWheelZoom={true}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      {farm.zones.map(zone => {
                        if (!zone.location) return null;
                        const zoneStatus = getZoneStatus(zone);
                        
                        return (
                          <Marker 
                            key={zone.id} 
                            position={zone.location}
                            icon={createCustomIcon(zoneStatus)}
                          >
                            <Popup className="custom-popup min-w-[240px] rounded-xl overflow-hidden shadow-xl border border-gray-200">
                              <div className="space-y-3">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-3 -mx-3 -mt-3">
                                  <h4 className="font-bold text-lg text-white">{zone.name}</h4>
                                  <div className="text-sm text-blue-100">Farm: {farm.name}</div>
                                </div>
                                
                                {zone.plant_types?.length > 0 && (
                                  <div>
                                    <h5 className="font-medium text-sm text-gray-700 mb-2">Plant Types</h5>
                                    <div className="flex flex-wrap gap-2">
                                      {zone.plant_types.map(plant => (
                                        <span 
                                          key={plant.id} 
                                          className="text-xs bg-green-50 text-green-800 px-3 py-1 rounded-full border border-green-200"
                                        >
                                          {plant.name}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {zone.sensors?.length > 0 && (
                                  <div>
                                    <h5 className="font-medium text-sm text-gray-700 mb-2">Sensor Readings</h5>
                                    <div className="space-y-2">
                                      {zone.sensors.map(sensor => {
                                        const status = getSensorStatus(sensor);
                                        return (
                                          <div 
                                            key={sensor.id} 
                                            className={`px-3 py-2 rounded-lg ${
                                              status === 'alert' ? 'bg-red-50 text-red-800 border border-red-200' :
                                              status === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                                              'bg-green-50 text-green-800 border border-green-200'
                                            }`}
                                          >
                                            <div className="flex justify-between items-center">
                                              <span className="capitalize font-medium">{sensor.type.replace('_', ' ')}</span>
                                              <span className="font-semibold">
                                                {sensor.latest_measure?.value || '--'}
                                                {sensor.type === 'temperature' ? '°C' : '%'}
                                              </span>
                                            </div>
                                            {sensor.latest_measure?.measured_at && (
                                              <div className="text-xs text-gray-500 mt-1">
                                                {new Date(sensor.latest_measure.measured_at).toLocaleTimeString()}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </Popup>
                          </Marker>
                        );
                      })}
                    </MapContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-gray-50 text-gray-500 p-4">
                      <div className="p-3 bg-white rounded-full mb-3 shadow-sm">
                        <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
                      </div>
                      <p className="text-center">No zones with coordinates found</p>
                      <Link 
                        href={`/farms/${farm.id}/edit`} 
                        className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <span>Add zones to this farm</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}