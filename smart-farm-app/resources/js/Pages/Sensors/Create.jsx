import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function SensorCreate({ auth }) {
    const { farms } = usePage().props;
    const [selectedFarmId, setSelectedFarmId] = useState('');
    
    const { data, setData, post, processing, errors } = useForm({
        zone_id: '',
        type: 'temperature',
        identifier_code: '',
        position: '',
        latitude: '',
        longitude: '',
    });

    const selectedFarm = farms.find(farm => farm.id == selectedFarmId);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('sensors.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Add New Sensor" />
            
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center mb-8">
                    <Link 
                        href={route('sensors.index')} 
                        className="flex items-center text-sm text-green-600 hover:text-green-800 mr-6"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Sensors
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Sensor</h1>
                </div>

                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Farm Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Farm <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={selectedFarmId}
                                        onChange={(e) => {
                                            setSelectedFarmId(e.target.value);
                                            setData('zone_id', '');
                                        }}
                                        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${errors.farm_id ? 'border-red-500' : ''}`}
                                        required
                                    >
                                        <option value="">Select a Farm</option>
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
                                        Zone <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.zone_id}
                                        onChange={(e) => setData('zone_id', e.target.value)}
                                        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${errors.zone_id ? 'border-red-500' : ''}`}
                                        disabled={!selectedFarmId}
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
                                        <p className="mt-1 text-sm text-red-600">{errors.zone_id}</p>
                                    )}
                                </div>

                                {/* Sensor Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sensor Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${errors.type ? 'border-red-500' : ''}`}
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
                                        Identifier Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.identifier_code}
                                        onChange={(e) => setData('identifier_code', e.target.value)}
                                        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${errors.identifier_code ? 'border-red-500' : ''}`}
                                        placeholder="e.g., TEMP-001"
                                        required
                                    />
                                    {errors.identifier_code && (
                                        <p className="mt-1 text-sm text-red-600">{errors.identifier_code}</p>
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
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        placeholder="e.g., Near north entrance"
                                    />
                                </div>

                                {/* Coordinates */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Coordinates <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="number"
                                                step="any"
                                                value={data.latitude}
                                                onChange={(e) => setData('latitude', e.target.value)}
                                                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${errors.latitude ? 'border-red-500' : ''}`}
                                                placeholder="Latitude"
                                                required
                                            />
                                            {errors.latitude && (
                                                <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                type="number"
                                                step="any"
                                                value={data.longitude}
                                                onChange={(e) => setData('longitude', e.target.value)}
                                                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${errors.longitude ? 'border-red-500' : ''}`}
                                                placeholder="Longitude"
                                                required
                                            />
                                            {errors.longitude && (
                                                <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                                <Link
                                    href={route('sensors.index')}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                    {processing ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : 'Save Sensor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}