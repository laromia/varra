import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function SensorIndex({ auth }) {
    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Add error state
    const { flash } = usePage().props;

    useEffect(() => {
        axios.get('/api/sensors')
            .then(response => {
                // Add null checks for response data
                if (response.data && response.data.farms) {
                    setFarms(response.data.farms);
                } else {
                    setFarms([]); // Ensure farms is always an array
                    console.warn('Unexpected API response structure');
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Sensor Management" />
            
            <div className="max-w-7xl mx-auto p-6">
                {flash.success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
                        {flash.success}
                    </div>
                )}
                
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
                    <h2 className="text-lg font-semibold mb-4">Select Farm & Zone</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Add conditional rendering */}
                        {farms && farms.length > 0 ? (
                            farms.map(farm => (
                                <div key={farm.id} className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-medium text-lg mb-3">{farm.name}</h3>
                                    
                                    <div className="space-y-2">
                                        {farm.zones && farm.zones.map(zone => (
                                            <Link 
                                                key={zone.id} 
                                                href={`/sensors/zone/${zone.id}`}
                                                className="block p-3 hover:bg-gray-50 rounded-lg border border-gray-100 transition"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span>{zone.name}</span>
                                                    <span className="text-sm text-gray-500">
                                                        {zone.sensors_count} sensor{zone.sensors_count !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-8 text-gray-500">
                                No farms available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}