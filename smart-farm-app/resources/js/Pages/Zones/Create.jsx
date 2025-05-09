import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowLeftIcon, PlusIcon } from '@/Components/Icons';
import  { useState } from 'react';

export default function CreateZone({ auth, farms, plantTypes}) {
    const [formData, setFormData] = useState({
      name: '',
      farm_id: farms[0]?.id || '',
      plant_type_ids: [] 
    });
    const [processing, setProcessing] = useState(false);
  
    const { flash, errors = {} } = usePage().props;
  

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true); // Set processing to true when submitting
        
        router.post('/zones', formData, {
          onSuccess: () => {
            setFormData({
              name: '',
              farm_id: farms[0]?.id || ''
            });
          },
          onError: (errors) => {
            console.error('Form errors:', errors);
          },
          onFinish: () => {
            setProcessing(false); // Reset when request completes
          }
        });
      };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Create New Zone" />
      
      {/* Safe flash message rendering */}
      {flash?.success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {flash.success}
        </div>
      )}

      {flash?.error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {flash.error}
        </div>
      )}
      
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center mb-6">
          <Link 
            href="/zones" 
            className="flex items-center text-gray-600 hover:text-blue-600 mr-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
            Back to Zones
          </Link>
          <h1 className="text-2xl font-bold">Create New Zone</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
  {/* Zone Name Field */}
  <div>
    <label htmlFor="zone-name" className="block text-sm font-medium text-gray-700 mb-1">
      Zone Name
      <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      id="zone-name"
      className={`block w-full rounded-md ${
        errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
      } focus:border-green-500 shadow-sm sm:text-sm`}
      value={formData.name}
      onChange={(e) => setFormData({...formData, name: e.target.value})}
      required
    />
    {errors?.name && (
      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
    )}
  </div>

  {/* Farm Selection */}
  <div>
    <label htmlFor="farm" className="block text-sm font-medium text-gray-700 mb-1">
      Associated Farm
      <span className="text-red-500">*</span>
    </label>
    <select
      id="farm"
      className={`block w-full rounded-md ${
        errors.farm_id ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
      } focus:border-green-500 shadow-sm sm:text-sm`}
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
      <p className="mt-1 text-sm text-red-600">{errors.farm_id}</p>
    )}
  </div>
  
  <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Plant Types
  </label>
  <div className="space-y-2">
    {[...new Map(plantTypes.map(type => [type.name, type])).values()].map((type) => (
      <label key={type.id} className="flex items-center space-x-2">
        <input
          type="checkbox"
          value={type.id}
          checked={formData.plant_type_ids.includes(type.id.toString())}
          onChange={(e) => {
            const id = e.target.value;
            const isChecked = e.target.checked;
            setFormData((prev) => ({
              ...prev,
              plant_type_ids: isChecked
                ? [...prev.plant_type_ids, id]
                : prev.plant_type_ids.filter((pid) => pid !== id),
            }));
          }}
          className="h-4 w-4 text-green-600 border-gray-300 rounded"
        />
        <span className="text-sm text-gray-700">{type.name}</span>
      </label>
    ))}
  </div>
</div>


  {/* Form Actions */}
  <div className="flex justify-end space-x-3 pt-4">
    <Link
      href="/zones"
      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
    >
      Cancel
    </Link>
    <button
      type="submit"
      disabled={processing}
      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
        processing ? 'opacity-75 cursor-not-allowed' : ''
      }`}
    >
      {processing ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
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