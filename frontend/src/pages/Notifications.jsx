import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Bell, Check, Clock } from 'lucide-react';
import { format } from 'date-fns';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notifications/${user.citizenId}`);
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.citizenId) fetchNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}`);
      setNotifications(notifications.map(n => 
        n.notification_id === id ? { ...n, status: 'Read' } : n
      ));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  if (loading) return <div className="flex justify-center h-64 items-center">Loading notifications...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-2 text-slate-600">Your latest alerts and updates.</p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <Bell className="h-12 w-12 text-slate-300 mb-3" />
            <p>You have no notifications.</p>
          </div>
        ) : (
          notifications.map(notif => {
            const isUnread = notif.status === 'Unread';
            return (
              <div key={notif.notification_id} className={`p-6 transition-colors ${isUnread ? 'bg-indigo-50/50 hover:bg-indigo-50' : 'hover:bg-slate-50' }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <div className="mt-1 mr-4">
                      {isUnread ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-[0_0_0_4px_rgba(79,70,229,0.1)]"></div>
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                      )}
                    </div>
                    <div>
                      <p className={`text-[15px] ${isUnread ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                        {notif.message}
                      </p>
                      {notif.notification_date && (
                        <div className="flex items-center text-xs text-slate-400 mt-2">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {format(new Date(notif.notification_date), 'MMM dd, yyyy - h:mm a')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isUnread && (
                    <button 
                      onClick={() => markAsRead(notif.notification_id)}
                      className="ml-4 flex items-center shrink-0 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1.5 rounded-md border border-indigo-200 hover:border-indigo-300 transition-colors"
                    >
                      <Check className="w-4 h-4 mr-1.5" /> Mark read
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
