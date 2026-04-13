import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity } from 'lucide-react';
import { format } from 'date-fns';

const AuditTrail = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/audit');
        setLogs(res.data);
      } catch (err) {
        console.error('Error fetching audit logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuditLogs();
  }, []);

  if (loading) return <div className="flex justify-center h-64 items-center">Loading audit records...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 inline-flex items-center">
            <Activity className="mr-3 h-8 w-8 text-blue-600" /> System Audit Trail
          </h1>
          <p className="mt-2 text-slate-600">Track all sensitive actions performed across the platform.</p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-sm">
                <th className="px-6 py-4 font-semibold w-1/4">Timestamp</th>
                <th className="px-6 py-4 font-semibold w-1/4">Action Label</th>
                <th className="px-6 py-4 font-semibold w-1/2">Citizen Tracking ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {logs.map((log) => (
                <tr key={log.audit_id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">
                    {log.action_date ? format(new Date(log.action_date), 'yyyy-MM-dd HH:mm:ss') : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md text-xs">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-blue-600">
                    CID-{log.citizen_id}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                    No audit records found.
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

export default AuditTrail;
