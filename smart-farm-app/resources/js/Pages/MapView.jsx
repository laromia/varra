// resources/js/Pages/MapView.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Color-coded marker icons
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
  const { farms = [] } = usePage().props;

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
    return zone.sensors.reduce((status, sensor) => {
      const current = getSensorStatus(sensor);
      return current === 'alert' ? 'alert' : 
             current === 'warning' ? 'warning' : status;
    }, 'good');
  };

  const getFarmWarnings = (farm) => {
    const warnings = [];
    
    farm.zones.forEach(zone => {
      zone.sensors.forEach(sensor => {
        const status = getSensorStatus(sensor);
        if (status !== 'good') {
          warnings.push({
            zone: zone.name,
            sensor: sensor.type,
            value: sensor.latest_measure?.value,
            status
          });
        }
      });
    });
    
    return warnings;
  };

  if (!farms.length) {
    return (
      <AuthenticatedLayout>
        <Head title="Farm Maps" />
        <div className="p-4">
          <p>No farms found. Please create some farms first.</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Head title="Farm Maps" />
      <div className="p-4 space-y-8">
        {farms.map(farm => {
          const farmWarnings = getFarmWarnings(farm);
          
          return (
            <div key={farm.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{farm.name}</h2>
                {farmWarnings.length > 0 && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    {farmWarnings.length} warning{farmWarnings.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Farm warnings summary */}
              {farmWarnings.length > 0 && (
                <div className="mb-4 space-y-2">
                  {farmWarnings.map((warning, index) => (
                    <div 
                      key={index} 
                      className={`p-2 rounded ${
                        warning.status === 'alert' ? 'bg-red-50 border-l-4 border-red-500' :
                        'bg-yellow-50 border-l-4 border-yellow-500'
                      }`}
                    >
                      <div className="font-medium">
                        {warning.zone} - {warning.sensor}: {warning.value}
                        {warning.sensor === 'temperature' ? '°C' : '%'}
                      </div>
                      <div className="text-sm">
                        {warning.status === 'alert' ? 'Critical alert' : 'Warning'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="h-64 w-full rounded-md overflow-hidden border border-gray-200">
                {farm.zones.length > 0 ? (
                  <MapContainer
                    center={farm.zones[0].location}
                    zoom={14}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {farm.zones.map(zone => {
                      const zoneStatus = getZoneStatus(zone);
                      
                      return (
                        <Marker 
                          key={zone.id} 
                          position={zone.location}
                          icon={icons[zoneStatus]}
                        >
                          <Popup className="custom-popup">
                            <div className="font-bold">{zone.name}</div>
                            <div className="mt-2 space-y-2">
                              {zone.plant_types?.map(plant => (
                                <div key={plant.id} className="text-sm bg-green-100 px-2 py-1 rounded">
                                  {plant.name}
                                </div>
                              ))}
                              {zone.sensors.map(sensor => {
                                const status = getSensorStatus(sensor);
                                return (
                                  <div 
                                    key={sensor.id} 
                                    className={`text-sm px-2 py-1 rounded ${
                                      status === 'alert' ? 'bg-red-100 text-red-800' :
                                      status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                    }`}
                                  >
                                    {sensor.type}: {sensor.latest_measure?.value || '--'}
                                    {sensor.type === 'temperature' ? '°C' : '%'}
                                    <span className="ml-2 text-xs">
                                      ({status})
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    No zones with coordinates found
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AuthenticatedLayout>
  );
}