import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function SensorIndex({ auth, farms }) {
    const { delete: destroy } = useForm();

    const handleDelete = (sensorId) => {
        if (confirm('Are you sure you want to delete this sensor?')) {
            destroy(`/sensors/${sensorId}`);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Sensor Management" />
            
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Sensor Management</h1>
                    <Link 
                        href="/sensors/create" 
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        Add New Sensor
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="space-y-8">
                        {farms && farms.length > 0 ? (
                            farms.map(farm => (
                                <div key={farm.id} className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-medium text-lg mb-4">{farm.name}</h3>
                                    
                                    {farm.zones && farm.zones.length > 0 ? (
                                        farm.zones.map(zone => (
                                            <div key={zone.id} className="mb-6">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="font-medium text-md">{zone.name}</h4>
                                                    <span className="text-sm text-gray-500">
                                                        {zone.sensors_count} sensor{zone.sensors_count !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                                
                                                {zone.sensors && zone.sensors.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {zone.sensors.map(sensor => (
                                                            <div key={sensor.id} className="border border-gray-100 rounded-lg p-4">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h5 className="font-medium">{sensor.identifier_code}</h5>
                                                                        <p className="text-sm text-gray-500 capitalize">{sensor.type.replace('_', ' ')}</p>
                                                                    </div>
                                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                                        sensor.type === 'temperature' ? 'bg-red-100 text-red-800' :
                                                                        sensor.type === 'humidity' ? 'bg-blue-100 text-blue-800' :
                                                                        'bg-green-100 text-green-800'
                                                                    }`}>
                                                                        {sensor.type}
                                                                    </span>
                                                                </div>
                                                                
                                                                <div className="mt-3 space-y-1 text-sm">
                                                                    {sensor.position && (
                                                                        <p>Position: {sensor.position}</p>
                                                                    )}
                                                                    {sensor.latitude && sensor.longitude && (
                                                                        <p>Coordinates: {sensor.latitude}, {sensor.longitude}</p>
                                                                    )}
                                                                </div>
                                                                
                                                                <div className="mt-3 flex space-x-2">
                                                                    <Link 
                                                                        href={`/sensors/${sensor.id}/edit`}
                                                                        className="text-xs text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        Edit
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleDelete(sensor.id)}
                                                                        className="text-xs text-red-600 hover:text-red-800"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-4 text-gray-500">
                                                        No sensors in this zone
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-gray-500">
                                            No zones available in this farm
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No farms available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}