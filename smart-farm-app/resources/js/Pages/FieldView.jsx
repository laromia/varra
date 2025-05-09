// resources/js/Pages/FieldView.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import FarmGrid from '@/Components/FarmGrid';

export default function FieldView() {
  const { farms } = usePage().props;

  return (
    <AuthenticatedLayout>
      <Head title="Field View" />
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Field Status Overview</h1>
        {farms.map(farm => (
          <div key={farm.id} className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              {farm.name}
            </h2>
            <FarmGrid zones={farm.zones} />
          </div>
        ))}
      </div>
    </AuthenticatedLayout>
  );
}