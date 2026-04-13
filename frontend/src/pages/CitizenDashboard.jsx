import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FileText, Bell, CheckCircle, Clock, XCircle, User } from 'lucide-react';
import { format } from 'date-fns';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [citizen, setCitizen] = useState(null);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [citizenRes, appsRes, notifsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/citizens/${user.citizenId}`),
          axios.get(`http://localhost:5000/api/applications/${user.citizenId}`),
          axios.get(`http://localhost:5000/api/notifications/${user.citizenId}`)
        ]);

        setCitizen(citizenRes.data);
        setApplications(appsRes.data);
        setNotifications(notifsRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.citizenId) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-900"></div></div>;
  }

  const approvedCount = applications.filter(a => a.status === 'Approved').length;
  const pendingCount = applications.filter(a => a.status === 'Pending').length;
  const unreadNotifs = notifications.filter(n => n.status === 'Unread');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Welcome, {citizen?.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex items-center text-slate-500 mb-2">
            <FileText className="h-5 w-5 mr-2" /> 
            <span className="font-medium">Total Applications</span>
          </div>
          <span className="text-4xl font-bold text-slate-900">{applications.length}</span>
        </div>
        
        <div className="bg-emerald-50 rounded-xl shadow-sm border border-emerald-100 p-6 flex flex-col">
          <div className="flex items-center text-emerald-700 mb-2">
            <CheckCircle className="h-5 w-5 mr-2" /> 
            <span className="font-medium">Approved</span>
          </div>
          <span className="text-4xl font-bold text-emerald-800">{approvedCount}</span>
        </div>

        <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-100 p-6 flex flex-col">
          <div className="flex items-center text-amber-700 mb-2">
            <Clock className="h-5 w-5 mr-2" /> 
            <span className="font-medium">Pending</span>
          </div>
          <span className="text-4xl font-bold text-amber-800">{pendingCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <User className="mr-2 h-5 w-5 text-navy-500" /> My Profile
          </h2>
          {citizen && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-slate-500">Gender</div>
              <div className="font-medium text-slate-900">{citizen.gender}</div>
              
              <div className="text-slate-500">Age</div>
              <div className="font-medium text-slate-900">{citizen.age} years</div>
              
              <div className="text-slate-500">Annual Income</div>
              <div className="font-medium text-slate-900">₹{citizen.income.toLocaleString()}</div>
              
              <div className="text-slate-500">Caste Category</div>
              <div className="font-medium text-slate-900">{citizen.caste}</div>
              
              <div className="text-slate-500">Education</div>
              <div className="font-medium text-slate-900 capitalize">{citizen.education}</div>
              
              <div className="text-slate-500">Address</div>
              <div className="font-medium text-slate-900 capitalize">{citizen.address}</div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <Bell className="mr-2 h-5 w-5 text-indigo-500" /> Notifications
            </h2>
            {unreadNotifs.length > 0 && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {unreadNotifs.length} New
              </span>
            )}
          </div>
          
          <div className="space-y-4">
            {notifications.slice(0, 5).map(notif => (
              <div key={notif.notification_id} className={`p-3 rounded-lg border flex items-start ${notif.status === 'Unread' ? 'bg-indigo-50 border-indigo-100' : 'border-slate-100 bg-slate-50'}`}>
                <div className={`mt-0.5 w-2 h-2 rounded-full mr-3 shrink-0 ${notif.status === 'Unread' ? 'bg-indigo-500' : 'bg-transparent'}`}></div>
                <div>
                  <p className={`text-sm ${notif.status === 'Unread' ? 'font-medium text-indigo-900' : 'text-slate-600'}`}>
                    {notif.message}
                  </p>
                  {notif.notification_date && (
                    <p className="text-xs text-slate-400 mt-1">
                      {format(new Date(notif.notification_date), 'dd MMM yyyy')}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No new notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
