// resources/js/Components/FarmGrid.jsx
import { Link } from '@inertiajs/react';

const getSensorStatus = (sensor) => {
  // ... (keep your existing sensor status logic) ...
};

export default function FarmGrid({ zones }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {zones.map(zone => {
        // Safely access plant types (both possible variants)
        const plants = zone.plant_types || zone.plantTypes || [];
        
        const alertCount = zone.sensors.filter(
          sensor => getSensorStatus(sensor) === 'alert'
        ).length;

        return (
          <Link
            key={zone.id}
            href={`/zones/${zone.id}`}
            className={`block p-4 rounded-lg border-2 transition-all hover:shadow-md ${
              alertCount > 0 
                ? 'border-red-500 bg-red-50 hover:bg-red-100' 
                : 'border-green-300 hover:bg-green-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{zone.name}</h3>
              {alertCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {alertCount} alert{alertCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {/* Plant tags - works with both naming conventions */}
            <div className="mt-2 flex flex-wrap gap-1">
              {plants.length > 0 ? (
                plants.map(plant => (
                  <span 
                    key={plant.id} 
                    className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded"
                  >
                    {plant.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500">No crops assigned</span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}