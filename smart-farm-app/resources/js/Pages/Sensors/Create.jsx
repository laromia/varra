// resources/js/Pages/Sensors/Create.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function SensorCreate({ auth }) {
    const { farms } = usePage().props;
    const [selectedFarmId, setSelectedFarmId] = useState('');
    const [selectedZoneId, setSelectedZoneId] = useState('');
    
    const { data, setData, post, processing, errors } = useForm({
        zone_id: '',
        type: 'temperature',
        identifier_code: '',
        position: '',
        latitude: '',
        longitude: '',
        plant_type_id: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('sensors.store'));
    };

    const selectedFarm = farms.find(farm => farm.id == selectedFarmId);
    const selectedZone = selectedFarm?.zones.find(zone => zone.id == selectedZoneId);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Add New Sensor" />
            
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex items-center mb-6">
                    <Link 
                        href={route('sensors.index')} 
                        className="mr-4 text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Sensors
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Sensor</h1>
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
                                        setSelectedZoneId('');
                                        setData('zone_id', '');
                                    }}
                                    className="w-full rounded-lg border-gray-300"
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
                                    Zone
                                </label>
                                <select
                                    value={selectedZoneId}
                                    onChange={(e) => {
                                        setSelectedZoneId(e.target.value);
                                        setData('zone_id', e.target.value);
                                    }}
                                    className="w-full rounded-lg border-gray-300"
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

                            {/* Plant Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Plant Type (Optional)
                                </label>
                                <select
                                    value={data.plant_type_id}
                                    onChange={(e) => setData('plant_type_id', e.target.value)}
                                    className="w-full rounded-lg border-gray-300"
                                    disabled={!selectedZoneId}
                                >
                                    <option value="">No specific plant</option>
                                    {selectedZone?.plant_types.map(plant => (
                                        <option key={plant.id} value={plant.id}>
                                            {plant.name}
                                        </option>
                                    ))}
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
                                    placeholder="e.g., TEMP-001"
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

                            {/* Latitude */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Latitude
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    value={data.latitude}
                                    onChange={(e) => setData('latitude', e.target.value)}
                                    className="w-full rounded-lg border-gray-300"
                                    required
                                />
                                {errors.latitude && (
                                    <p className="text-sm text-red-600 mt-1">{errors.latitude}</p>
                                )}
                            </div>

                            {/* Longitude */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Longitude
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    value={data.longitude}
                                    onChange={(e) => setData('longitude', e.target.value)}
                                    className="w-full rounded-lg border-gray-300"
                                    required
                                />
                                {errors.longitude && (
                                    <p className="text-sm text-red-600 mt-1">{errors.longitude}</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {processing ? 'Adding...' : 'Add Sensor'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}