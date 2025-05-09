import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import {
  FarmIcon,
  PlantIcon,
  ChevronIcon,
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon
} from '@/Components/Icons';


const Zones = ({ auth }) => {
  const { zones } = usePage().props; // From controller
  const [expandedZone, setExpandedZone] = useState(null);

  const getSensorStatus = (sensor) => {
    const value = sensor.latest_measure?.value;
    if (!value) return 'warning';
    // Your existing logic for sensor status
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
  {/* Back to Dashboard */}
  <Link 
    href="/dashboard" 
    className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"></div>
    <ArrowLeftIcon className="relative z-10 w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:-translate-x-1" />
    <span className="relative z-10 font-medium">Back to Dashboard</span>
  </Link>

  {/* Add Zone */}
  <Link
  href="/zones/create"
  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-300"
>
  <PlusIcon className="w-5 h-5" />
  <span>Add Zone</span>
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
  <FarmIcon className="w-5 h-5 text-green-600" />
  <h2 className="font-medium">{zone.name}</h2>
  <span className="text-sm text-gray-500">
    (Farm: {zone.farm.name})
  </span>
  <button
    onClick={(e) => handleDeleteZone(zone.id, e)}
    className="ml-4 text-red-500 hover:text-red-700 transition-colors"
    title="Delete Zone"
  >
    <TrashIcon className="w-4 h-4" />
  </button>
</div>

                <div className="flex gap-2">
                  {zone.plant_types && zone.plant_types.length > 0 ? (
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
) : (
  <span className="text-gray-500 text-sm">No plants assigned</span>
)}
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
