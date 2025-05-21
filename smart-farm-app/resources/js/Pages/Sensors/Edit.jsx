import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function SensorEdit({ auth }) {
    const { sensor, farms } = usePage().props;
    const [selectedFarmId, setSelectedFarmId] = useState(sensor.zone.farm_id);
    
    const { data, setData, put, processing, errors } = useForm({
        zone_id: sensor.zone_id,
        type: sensor.type,
        identifier_code: sensor.identifier_code,
        position: sensor.position || '',
        latitude: sensor.latitude || '',
        longitude: sensor.longitude || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/sensors/${sensor.id}`);
    };

    const selectedFarm = farms.find(farm => farm.id == selectedFarmId);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Sensor" />
            
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex items-center mb-6">
                    <Link 
                        href="/sensors" 
                        className="mr-4 text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Sensors
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Sensor: {sensor.identifier_code}</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Farm Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Farm
                                </label>
                                <select
                                    value={selectedFarmId}
                                    onChange={(e) => {
                                        setSelectedFarmId(e.target.value);
                                        setData('zone_id', '');
                                    }}
                                    className="w-full rounded-lg border-gray-300"
                                    required
                                >
                                    {farms.map(farm => (
                                        <option key={farm.id} value={farm.id}>
                                            {farm.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Zone Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Zone
                                </label>
                                <select
                                    value={data.zone_id}
                                    onChange={(e) => setData('zone_id', e.target.value)}
                                    className="w-full rounded-lg border-gray-300"
                                    required
                                >
                                    <option value="">Select a Zone</option>
                                    {selectedFarm?.zones.map(zone => (
                                        <option key={zone.id} value={zone.id}>
                                            {zone.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.zone_id && (
                                    <p className="text-sm text-red-600 mt-1">{errors.zone_id}</p>
                                )}
                            </div>

                            {/* Sensor Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sensor Type
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full rounded-lg border-gray-300"
                                    required
                                >
                                    <option value="temperature">Temperature</option>
                                    <option value="humidity">Humidity</option>
                                    <option value="soil_moisture">Soil Moisture</option>
                                </select>
                            </div>

                            {/* Identifier Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Identifier Code
                                </label>
                                <input
                                    type="text"
                                    value={data.identifier_code}
                                    onChange={(e) => setData('identifier_code', e.target.value)}
                                    className="w-full rounded-lg border-gray-300"
                                    required
                                />
                                {errors.identifier_code && (
                                    <p className="text-sm text-red-600 mt-1">{errors.identifier_code}</p>
                                )}
                            </div>

                            {/* Position Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Position Description
                                </label>
                                <input
                                    type="text"
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                    className="w-full rounded-lg border-gray-300"
                                    placeholder="e.g., Near north entrance"
                                />
                            </div>

                            {/* Coordinates */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Coordinates
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <input
                                            type="number"
                                            step="any"
                                            value={data.latitude}
                                            onChange={(e) => setData('latitude', e.target.value)}
                                            className="w-full rounded-lg border-gray-300"
                                            placeholder="Latitude"
                                        />
                                        {errors.latitude && (
                                            <p className="text-sm text-red-600 mt-1">{errors.latitude}</p>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="any"
                                            value={data.longitude}
                                            onChange={(e) => setData('longitude', e.target.value)}
                                            className="w-full rounded-lg border-gray-300"
                                            placeholder="Longitude"
                                        />
                                        {errors.longitude && (
                                            <p className="text-sm text-red-600 mt-1">{errors.longitude}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex space-x-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                            <Link 
                                href="/sensors" 
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}