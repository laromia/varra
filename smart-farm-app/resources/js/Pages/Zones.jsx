import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router} from '@inertiajs/react';
import { 
  FarmIcon,
  ThermometerIcon,
  DropletIcon,
  PlantIcon,
  AlertIcon,
  ChevronIcon,
  ArrowLeftIcon,  // Add this
  PlusIcon,       // Add this
  TrashIcon   
} from '@/Components/Icons';

const Zones = ({ auth }) => {
  const { zones } = usePage().props; // From controller
  const [expandedZone, setExpandedZone] = useState(null);

  // Reuse your dashboard's status calculator
  const getSensorStatus = (sensor) => {
    const value = sensor.latest_measure?.value;
    if (!value) return 'warning';
    // ... paste your existing status logic ...
  };
  const handleDeleteZone = async (zoneId, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this zone?')) {
      try {
        await router.delete(`/api/zones/${zoneId}`);
        router.reload(); // Refresh the page to see changes
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete zone');
      }
    }
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Zones" />
      <div className="flex justify-between items-center mb-8 border-b pb-4">
      <Link 
    href="/dashboard" 
    className="relative inline-flex items-center px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group"
  >
    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <ArrowLeftIcon className="relative z-10 w-5 h-5 text-blue-600 mr-2 transition-transform group-hover:-translate-x-1" />
    <span className="relative z-10 font-medium text-gray-800">Back to Dashboard</span>
  </Link>

  <Link
    href="/zones/create"
    className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
  >
    <PlusIcon className="w-5 h-5 mr-1" />
    Add Zone
  </Link>
</div>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">All Zones</h1>
        
        <div className="space-y-4">
          {zones.map(zone => (
            <div key={zone.id} className="bg-white rounded-lg shadow p-4">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setExpandedZone(expandedZone === zone.id ? null : zone.id)}
              >
                <div className="flex items-center gap-3">

                  <FarmIcon className="w-5 h-5 text-green-600"/>
                  <h2 className="font-medium">{zone.name}</h2>
                  <span className="text-sm text-gray-500">
                    (Farm: {zone.farm.name})
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="flex items-center text-sm">
                    <PlantIcon className="w-4 h-4 mr-1"/>
                    {zone.plant_types.length} plants
                  </span>
                  <button
      onClick={(e) => handleDeleteZone(zone.id, e)}
      className="text-red-500 hover:text-red-700"
      title="Delete zone"
    >
      <TrashIcon className="w-5 h-5" />
    </button>
                  <ChevronIcon 
                    className={`w-4 h-4 transition-transform ${
                      expandedZone === zone.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Expanded Content */}
              {expandedZone === zone.id && (
                <div className="mt-4 pl-8 space-y-3">
                  {/* Plants List */}
                  <div className="flex flex-wrap gap-2">
                    {zone.plant_types.map(plant => (
                      <span 
                        key={plant.id}
                        className="bg-green-50 text-green-800 text-xs px-2 py-1 rounded"
                      >
                        {plant.name}
                      </span>
                    ))}
                  </div>

                  {/* Sensors */}
                  <h3 className="font-medium mt-3">Sensors:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {zone.sensors.map(sensor => {
                      const status = getSensorStatus(sensor);
                      return (
                        <div key={sensor.id} className={`p-2 rounded border ${
                          status === 'alert' ? 'border-red-200 bg-red-50' : 
                          status === 'warning' ? 'border-yellow-200 bg-yellow-50' : 
                          'border-gray-200'
                        }`}>
                          <div className="flex justify-between">
                            <span className="capitalize">{sensor.type.replace('_', ' ')}</span>
                            <span className="font-medium">
                              {sensor.latest_measure?.value || '--'}
                              {sensor.type === 'temperature' ? '°C' : '%'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {sensor.latest_measure?.measured_at || 'No data'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Zones;