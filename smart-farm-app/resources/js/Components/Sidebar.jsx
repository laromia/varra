import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const links = [
  { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { name: 'Field View', icon: 'map', path: '/field-view' },
  { name: 'Zones', icon: 'location', path: '/zones' },
  { name: 'Sensor Management', icon: 'sensor', path: '/sensors' },
];

const getIcon = (iconName) => {
  const iconClasses = 'w-5 h-5 flex-shrink-0';
  switch (iconName) {
    case 'dashboard':
      return (
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case 'map':
      return (
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      );
    case 'location':
      return (
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'sensor':
      return (
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      );
    default:
      return null;
  }
};

export default function Sidebar({ open, onClose }) {
  const { url } = usePage();
  
  return (
    <aside className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gradient-to-b from-green-50 to-white border-r border-gray-200 overflow-y-auto transition-all duration-300 ease-in-out ${open ? 'translate-x-0 shadow-xl' : '-translate-x-full'} md:relative md:translate-x-0 md:shadow-none`}>
      <div className="h-full flex flex-col">
        {/* Logo/Brand Area */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Verra Farm
          </h2>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {links.map(link => (
            <Link
              key={link.name}
              href={link.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                url.startsWith(link.path)
                  ? 'bg-green-100 text-green-800 shadow-inner'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              <span className="mr-3 text-green-600">
                {getIcon(link.icon)}
              </span>
              <span>{link.name}</span>
              {url.startsWith(link.path) && (
                <span className="ml-auto h-2 w-2 rounded-full bg-green-500"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer/Sign Out Area */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center p-3 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </div>
        </div>
      </div>
    </aside>
  );
}