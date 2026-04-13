import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  FileText, 
  List, 
  Bell, 
  LogOut, 
  ShieldAlert, 
  Activity,
  Users,
  Database
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const citizenLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Schemes', path: '/schemes', icon: List },
    { name: 'My Applications', path: '/applications', icon: FileText },
    { name: 'My Documents', path: '/documents', icon: Database },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const adminLinks = [
    { name: 'Admin Hub', path: '/admin', icon: Home },
    { name: 'Fraud Panel', path: '/admin/fraud', icon: ShieldAlert },
    { name: 'Audit Trail', path: '/admin/audit', icon: Activity },
  ];

  const links = user.role === 'admin' ? adminLinks : citizenLinks;

  return (
    <div className="flex flex-col w-64 bg-navy-900 text-white min-h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-blue-50">GovScheme Portal</h1>
        <p className="text-sm text-navy-300 mt-1 uppercase tracking-wider font-semibold">
          {user.role === 'admin' ? 'Admin Panel' : 'Citizen Access'}
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group",
                isActive 
                  ? "bg-navy-800 text-white" 
                  : "text-navy-200 hover:bg-navy-800 hover:text-white"
              )}
            >
              <Icon className={cn("mr-3 flex-shrink-0 h-5 w-5", isActive ? "text-blue-400" : "text-navy-400 group-hover:text-blue-400")} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-navy-800">
        <div className="flex items-center px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user.username}</p>
            <p className="text-xs text-navy-300 capitalize">{user.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-400 hover:bg-navy-800 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
