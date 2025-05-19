import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head, usePage } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import 'leaflet/dist/leaflet.css';

// Custom marker icons with better visibility
const createCustomIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const icons = {
  good: createCustomIcon('green'),
  warning: createCustomIcon('orange'),
  alert: createCustomIcon('red')
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
    const warnings = [];
    
    farm.zones?.forEach(zone => {
      zone.sensors?.forEach(sensor => {
        const status = getSensorStatus(sensor);
        if (status !== 'good') {
          warnings.push({
            zone: zone.name,
            sensor: sensor.type,
            value: sensor.latest_measure?.value,
            status,
            timestamp: sensor.latest_measure?.measured_at
          });
        }
      });
    });
    
    return warnings;
  };

  if (!farms.length) {
    return (
      <AuthenticatedLayout user={auth.user}>
        <Head title="Farm Maps" />
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No farms available</h3>
            <p className="mt-2 text-sm text-gray-500">
              You need to create farms first to view them on the map.
            </p>
            <div className="mt-6">
              <Link
                href="/farms/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Farm Monitoring Map</h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time visualization of your farm zones and sensor data
            </p>
          </div>
          
          <Link 
            href="/dashboard" 
            className="group flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 hover:border-blue-300 shadow-xs hover:shadow-sm transition-all duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
              Back to Dashboard
            </span>
          </Link>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-sm">Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-500"></div>
            <span className="text-sm">No Data</span>
          </div>
        </div>

        {/* Farm cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {farms.map(farm => {
            const farmWarnings = getFarmWarnings(farm);
            const hasZones = farm.zones?.length > 0;
            const defaultLocation = hasZones ? farm.zones[0].location : [0, 0];
            
            return (
              <div key={farm.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition duration-300">
                {/* Farm Header */}
                <div className="p-5 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">{farm.name}</h2>
                      <p className="text-sm text-gray-500">{farm.location || 'No location specified'}</p>
                    </div>
                    {farmWarnings.length > 0 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {farmWarnings.length} alert{farmWarnings.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Warnings Summary */}
                {farmWarnings.length > 0 && (
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Current Alerts</h3>
                    <div className="space-y-2">
                      {farmWarnings.slice(0, 3).map((warning, index) => (
                        <div 
                          key={index} 
                          className={`p-2 rounded-md ${
                            warning.status === 'alert' ? 'bg-red-50 border-l-4 border-red-500' :
                            'bg-yellow-50 border-l-4 border-yellow-500'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium">{warning.zone}</span>
                              <span className="text-xs text-gray-500 ml-2">{warning.sensor}</span>
                            </div>
                            <span className="font-semibold">
                              {warning.value}
                              {warning.sensor === 'temperature' ? '°C' : '%'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {warning.timestamp || 'No timestamp'}
                          </div>
                        </div>
                      ))}
                      {farmWarnings.length > 3 && (
                        <div className="text-center text-sm text-gray-500">
                          +{farmWarnings.length - 3} more alerts
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Map Container */}
                <div className="h-64 w-full relative">
                  {hasZones ? (
                    <MapContainer
                      center={defaultLocation}
                      zoom={14}
                      style={{ height: '100%', width: '100%' }}
                      scrollWheelZoom={false}
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
                            icon={icons[zoneStatus]}
                          >
                            <Popup className="custom-popup min-w-[200px]">
                              <div className="space-y-2">
                                <h4 className="font-bold text-lg">{zone.name}</h4>
                                <div className="text-sm text-gray-500">Farm: {farm.name}</div>
                                
                                {zone.plant_types?.length > 0 && (
                                  <div className="mt-2">
                                    <h5 className="font-medium text-sm">Plant Types:</h5>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {zone.plant_types.map(plant => (
                                        <span key={plant.id} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                          {plant.name}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {zone.sensors?.length > 0 && (
                                  <div className="mt-2">
                                    <h5 className="font-medium text-sm">Sensors:</h5>
                                    <div className="space-y-1 mt-1">
                                      {zone.sensors.map(sensor => {
                                        const status = getSensorStatus(sensor);
                                        return (
                                          <div 
                                            key={sensor.id} 
                                            className={`text-xs px-2 py-1 rounded ${
                                              status === 'alert' ? 'bg-red-100 text-red-800' :
                                              status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                              'bg-green-100 text-green-800'
                                            }`}
                                          >
                                            <div className="flex justify-between">
                                              <span className="capitalize">{sensor.type}</span>
                                              <span className="font-medium">
                                                {sensor.latest_measure?.value || '--'}
                                                {sensor.type === 'temperature' ? '°C' : '%'}
                                              </span>
                                            </div>
                                            {sensor.latest_measure?.measured_at && (
                                              <div className="text-[0.65rem] text-gray-500 mt-0.5">
                                                {new Date(sensor.latest_measure.measured_at).toLocaleString()}
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
                      <ExclamationTriangleIcon className="w-8 h-8 mb-2" />
                      <p>No zones with coordinates found</p>
                      <Link 
                        href={`/farms/${farm.id}/edit`} 
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Add zones to this farm
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