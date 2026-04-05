import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '■' },
  { label: 'Projects', path: '/projects', icon: '■' },
  { label: 'Leads', path: '/leads', icon: '■' },
  { label: 'Sessions', path: '/sessions', icon: '■' },
  { label: 'Integrations', path: '/integrations', icon: '■' },
  { label: 'Subscriptions', path: '/subscriptions', icon: '■' },
  { label: 'Settings', path: '/settings', icon: '■' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <span className="text-xl font-bold text-gray-900">AI Platform</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === item.path
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="w-5 flex justify-center">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/login"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          Logout
        </Link>
      </div>
    </aside>
  );
}
