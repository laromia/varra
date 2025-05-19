import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowLeftIcon, PlusIcon } from '@/Components/Icons';
import { useState } from 'react';

export default function CreateZone({ auth, farms = [], plantTypes = []  }) {
    const [formData, setFormData] = useState({
        name: '',
        farm_id: farms[0]?.id || '',
        plant_type_ids: [],
        latitude: '',
        longitude: ''
    });
    const [processing, setProcessing] = useState(false);

    const { flash, errors = {} } = usePage().props;

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/zones', formData, {
            onSuccess: () => {
                setFormData({
                    name: '',
                    farm_id: farms[0]?.id || '',
                    plant_type_ids: [],
                    latitude: '',
                    longitude: ''
                });
            },
            onError: (errors) => {
                console.error('Form errors:', errors);
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create New Zone" />

            {/* Flash messages with better styling */}
            {flash?.success && (
                <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
                    {flash.success}
                </div>
            )}

            {flash?.error && (
                <div className="mb-4 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
                    {flash.error}
                </div>
            )}

            <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href="/zones"
                        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        <span>Back to Zones</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800">Create New Zone</h1>
                    <div className="w-10"></div> {/* Spacer for alignment */}
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                    {/* Zone Name Field */}
                    <div>
                        <label htmlFor="zone-name" className="block text-sm font-medium text-slate-700 mb-2">
                            Zone Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="zone-name"
                            className={`block w-full rounded-lg py-2 px-3 ${
                                errors.name 
                                    ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500' 
                                    : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                            } shadow-sm sm:text-sm`}
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                        {errors?.name && (
                            <p className="mt-2 text-sm text-rose-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Farm Selection */}
                    <div>
                        <label htmlFor="farm" className="block text-sm font-medium text-slate-700 mb-2">
                            Associated Farm <span className="text-rose-500">*</span>
                        </label>
                        <select
                            id="farm"
                            className={`block w-full rounded-lg py-2 px-3 ${
                                errors.farm_id 
                                    ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500' 
                                    : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                            } shadow-sm sm:text-sm`}
                            value={formData.farm_id}
                            onChange={(e) => setFormData({...formData, farm_id: e.target.value})}
                            required
                        >
                            <option value="">Select a farm</option>
                            {farms.map((farm) => (
                                <option key={farm.id} value={farm.id}>
                                    {farm.name}
                                </option>
                            ))}
                        </select>
                        {errors?.farm_id && (
                            <p className="mt-2 text-sm text-rose-600">{errors.farm_id}</p>
                        )}
                    </div>

                    {/* Plant Types */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Plant Types
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[...new Map(plantTypes.map(type => [type.name, type])).values()].map((type) => (
                                <label key={type.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-150">
                                    <input
                                        type="checkbox"
                                        value={type.id}
                                        checked={formData.plant_type_ids.includes(Number(type.id))}
                                        onChange={(e) => {
                                            const id = Number(e.target.value);
                                            const isChecked = e.target.checked;
                                            setFormData((prev) => ({
                                                ...prev,
                                                plant_type_ids: isChecked
                                                    ? [...prev.plant_type_ids, id]
                                                    : prev.plant_type_ids.filter((pid) => pid !== id),
                                            }));
                                        }}
                                        className="h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                                    />
                                    <span className="text-sm text-slate-700">{type.name}</span>
                                </label>
                            ))}
                        </div>
                        {errors?.plant_type_ids && (
                            <p className="mt-2 text-sm text-rose-600">{errors.plant_type_ids}</p>
                        )}
                    </div>

                    {/* Coordinates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Latitude Field */}
                        <div>
                            <label htmlFor="latitude" className="block text-sm font-medium text-slate-700 mb-2">
                                Latitude
                            </label>
                            <input
                                type="number"
                                step="any"
                                id="latitude"
                                className="block w-full rounded-lg py-2 px-3 border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm sm:text-sm"
                                value={formData.latitude}
                                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                            />
                        </div>

                        {/* Longitude Field */}
                        <div>
                            <label htmlFor="longitude" className="block text-sm font-medium text-slate-700 mb-2">
                                Longitude
                            </label>
                            <input
                                type="number"
                                step="any"
                                id="longitude"
                                className="block w-full rounded-lg py-2 px-3 border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm sm:text-sm"
                                value={formData.longitude}
                                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                        <Link
                            href="/zones"
                            className="inline-flex items-center justify-center px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className={`inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 ${
                                processing ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                                    Create Zone
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}