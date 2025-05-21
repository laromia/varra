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
import Sidebar from '@/Components/Sidebar';

const Zones = ({ auth }) => {
  const { zones } = usePage().props;
  const [expandedZone, setExpandedZone] = useState(null);
  const [deletingZone, setDeletingZone] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getSensorStatus = (sensor) => {
    const value = sensor.latest_measure?.value;
    if (!value) return 'warning';
    // Your existing logic for sensor status
  };

  const handleDeleteZone = async (zoneId, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this zone?')) {
      setDeletingZone(zoneId);
      try {
        await router.delete(`/api/zones/${zoneId}`);
        router.reload();
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete zone');
      } finally {
        setDeletingZone(null);
      }
    }
  };

  return (
    <>
      <Head title="Zones" />
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
                        user={auth.user}
                        header={
                          <div className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-green-100">
                            <h1 className="text-2xl font-bold text-green-800">Zone Management</h1>
                          </div>
                        }
                      >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 py-4 border-b border-gray-200">
                

                {/* Add Zone Button */}
                <Link
                  href="/zones/create"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-sm transition-all duration-200"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Add New Zone</span>
                </Link>
              </div>

              {/* Zones List */}
              <div className="space-y-4">
                {zones.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
                    <FarmIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No zones found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new zone.</p>
                    <div className="mt-6">
                      <Link
                        href="/zones/create"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        New Zone
                      </Link>
                    </div>
                  </div>
                ) : (
                  zones.map(zone => (
                    <div 
                      key={zone.id} 
                      className={`bg-white rounded-xl shadow-xs hover:shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 ${
                        expandedZone === zone.id ? 'ring-2 ring-blue-200' : ''
                      }`}
                    >
                      {/* Zone Header */}
                      <div 
                        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                        onClick={() => setExpandedZone(expandedZone === zone.id ? null : zone.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-50">
                            <FarmIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h2 className="font-medium text-gray-900">{zone.name}</h2>
                            <p className="text-sm text-gray-500">
                              Farm: <span className="font-medium">{zone.farm.name}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Plant Tags */}
                          <div className="hidden md:flex flex-wrap gap-2 max-w-xs">
                            {zone.plant_types?.length > 0 ? (
                              zone.plant_types.slice(0, 3).map(plant => (
                                <span 
                                  key={plant.id}
                                  className="bg-green-50 text-green-800 text-xs px-2.5 py-1 rounded-full flex items-center gap-1"
                                >
                                  <PlantIcon className="w-3 h-3" />
                                  {plant.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm">No plants</span>
                            )}
                            {zone.plant_types?.length > 3 && (
                              <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                                +{zone.plant_types.length - 3} more
                              </span>
                            )}
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={(e) => handleDeleteZone(zone.id, e)}
                            disabled={deletingZone === zone.id}
                            className={`p-2 rounded-lg hover:bg-red-50 transition-colors duration-200 ${
                              deletingZone === zone.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            title="Delete Zone"
                          >
                            {deletingZone === zone.id ? (
                              <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-600 transition-colors" />
                            )}
                          </button>

                          {/* Chevron Icon */}
                          <ChevronIcon 
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                              expandedZone === zone.id ? 'transform rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {expandedZone === zone.id && (
                        <div className="px-4 pb-4 border-t border-gray-200">
                          <div className="mt-4 pl-2 space-y-4">
                            {/* Plants Section */}
                            <div>
                              <h3 className="text-sm font-medium text-gray-700 mb-2">Plant Types</h3>
                              <div className="flex flex-wrap gap-2">
                                {zone.plant_types?.length > 0 ? (
                                  zone.plant_types.map(plant => (
                                    <span 
                                      key={plant.id}
                                      className="bg-green-50 text-green-800 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5"
                                    >
                                      <PlantIcon className="w-3 h-3" />
                                      {plant.name}
                                    </span>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500">No plant types assigned to this zone</p>
                                )}
                              </div>
                            </div>

                            {/* Sensors Section */}
                            <div>
                              <h3 className="text-sm font-medium text-gray-700 mb-2">Sensor Data</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {zone.sensors?.length > 0 ? (
                                  zone.sensors.map(sensor => {
                                    const status = getSensorStatus(sensor);
                                    return (
                                      <div 
                                        key={sensor.id} 
                                        className={`p-3 rounded-lg border ${
                                          status === 'alert' ? 'border-red-200 bg-red-50' : 
                                          status === 'warning' ? 'border-yellow-200 bg-yellow-50' : 
                                          'border-gray-200 bg-gray-50'
                                        }`}
                                      >
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm font-medium capitalize text-gray-700">
                                            {sensor.type.replace('_', ' ')}
                                          </span>
                                          <span className={`text-sm font-semibold ${
                                            status === 'alert' ? 'text-red-700' : 
                                            status === 'warning' ? 'text-yellow-700' : 
                                            'text-gray-700'
                                          }`}>
                                            {sensor.latest_measure?.value || '--'}
                                            {sensor.type === 'temperature' ? '°C' : '%'}
                                          </span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                          Last reading: {sensor.latest_measure?.measured_at || 'No data available'}
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p className="text-sm text-gray-500">No sensors configured for this zone</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </AuthenticatedLayout>
        </div>
      </div>
    </>
  );
};

export default Zones;