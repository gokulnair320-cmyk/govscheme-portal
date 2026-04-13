import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Clock, ShieldAlert, Users, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [citizensConfig, setCitizensConfig] = useState([]);
  const [fraudCount, setFraudCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, citRes, fraudRes] = await Promise.all([
          axios.get('http://localhost:5000/api/applications'),
          axios.get('http://localhost:5000/api/citizens'),
          axios.get('http://localhost:5000/api/fraud')
        ]);
        setApplications(appRes.data);
        setCitizensConfig(citRes.data);
        setFraudCount(fraudRes.data.length);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/${id}/status`, { status });
      setApplications(applications.map(app => 
        app.appId === id ? { ...app, status } : app
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  if (loading) return <div className="flex justify-center h-64 items-center">Loading dashboard...</div>;

  const pendingCount = applications.filter(a => a.status === 'Pending').length;
  const filteredApps = filter === 'All' ? applications : applications.filter(a => a.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Officer Dashboard</h1>
        <div className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          Admin Portal
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center text-slate-500 mb-2">
            <Users className="h-5 w-5 mr-2" /> Total Citizens
          </div>
          <span className="text-3xl font-bold text-slate-900">{citizensConfig.length}</span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center text-slate-500 mb-2">
            <FileText className="h-5 w-5 mr-2" /> Total Apps
          </div>
          <span className="text-3xl font-bold text-slate-900">{applications.length}</span>
        </div>

        <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-200 p-6">
          <div className="flex items-center text-amber-700 mb-2">
            <Clock className="h-5 w-5 mr-2" /> Action Required
          </div>
          <span className="text-3xl font-bold text-amber-800">{pendingCount}</span>
        </div>

        <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-6">
          <div className="flex items-center text-red-700 mb-2">
            <ShieldAlert className="h-5 w-5 mr-2" /> Fraud Flags
          </div>
          <span className="text-3xl font-bold text-red-800">{fraudCount}</span>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Application Management</h2>
          <div className="flex items-center space-x-2 text-sm">
            <span className="font-medium text-slate-600">Filter Status:</span>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border-slate-300 rounded-md text-sm pl-3 pr-8 py-1.5 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="All">All Apps</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4 font-semibold">Match / Applicant</th>
                <th className="px-6 py-4 font-semibold">Scheme Applied</th>
                <th className="px-6 py-4 font-semibold">Eligibility Log</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredApps.map((app) => (
                <tr key={app.appId} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{app.citizenName}</div>
                    <div className="text-slate-500 text-xs">ID: {app.citizen_id}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">{app.schemeName}</td>
                  <td className="px-6 py-4">
                    {app.eligibility_result === 'Eligible' ? (
                      <div className="flex items-center text-emerald-600 font-medium">
                        <CheckCircle className="w-4 h-4 mr-1" /> Eligible
                      </div>
                    ) : app.eligibility_result === 'Non-Eligible' ? (
                      <div className="text-slate-600 font-medium">
                        <span className="text-red-600 mr-1">✗</span> Ineligible
                        <p className="text-xs text-slate-400 font-normal">{app.remarks}</p>
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {app.status === 'Pending' ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(app.appId, 'Approved')}
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded shadow-sm text-xs font-semibold transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app.appId, 'Rejected')}
                          className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-3 py-1 rounded shadow-sm text-xs font-semibold transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No applications found matching the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
