import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FileText } from 'lucide-react';

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/applications/${user.citizenId}`);
        setApplications(res.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.citizenId) fetchApplications();
  }, [user]);

  if (loading) return <div className="flex justify-center h-64 items-center">Loading applications...</div>;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const getEligibilityBadge = (result) => {
    if (result === 'Eligible') return 'bg-green-100 text-green-800';
    if (result === 'Non-Eligible') return 'bg-gray-100 text-gray-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Applications</h1>
        <p className="mt-2 text-slate-600">Track the status of your scheme applications.</p>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center">
            <FileText className="h-12 w-12 text-slate-300 mb-3" />
            <p>You haven't applied for any schemes yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-sm">
                  <th className="px-6 py-4 font-semibold">App ID</th>
                  <th className="px-6 py-4 font-semibold">Scheme Name</th>
                  <th className="px-6 py-4 font-semibold">Eligibility Check</th>
                  <th className="px-6 py-4 font-semibold">System Remarks</th>
                  <th className="px-6 py-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {applications.map((app) => (
                  <tr key={app.appId} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">#{app.appId}</td>
                    <td className="px-6 py-4">{app.schemeName}</td>
                    <td className="px-6 py-4">
                      {app.eligibility_result ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEligibilityBadge(app.eligibility_result)}`}>
                          {app.eligibility_result}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={app.remarks}>
                      {app.remarks || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
