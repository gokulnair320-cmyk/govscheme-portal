import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

const FraudPanel = () => {
  const [frauds, setFrauds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFrauds = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/fraud');
        setFrauds(res.data);
      } catch (err) {
        console.error('Error fetching frauds:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFrauds();
  }, []);

  if (loading) return <div className="flex justify-center h-64 items-center">Loading fraud data...</div>;

  const getTypeColor = (type) => {
    const t = type.toLowerCase();
    if (t.includes('mismatch')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (t.includes('duplicate')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 inline-flex items-center">
            <ShieldAlert className="mr-3 h-8 w-8 text-red-600" /> Fraud Detection Panel
          </h1>
          <p className="mt-2 text-slate-600">Review flagged suspicious applications and duplicate accounts.</p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden mt-6">
        {frauds.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center bg-slate-50">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-lg font-medium text-slate-700">No active fraud flags detected</p>
            <p className="text-sm mt-1">The system has not identified any suspicious activities.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-red-50/50 text-slate-700 border-b border-red-100 text-sm">
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Flag ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Fraud Type</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Description Context</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {frauds.map((fraud) => (
                  <tr key={fraud.flagId} className="hover:bg-slate-50">
                    <td className="px-6 py-5 font-mono text-slate-500">FLAG-{fraud.flagId}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border capitalize ${getTypeColor(fraud.fraud_type)}`}>
                        {fraud.fraud_type}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-slate-400 mr-2 mt-0.5" />
                        <span className="font-medium text-slate-800">{fraud.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="inline-flex space-x-1">
                        <div className="w-2 h-4 bg-red-600 rounded-sm"></div>
                        <div className="w-2 h-4 bg-red-600 rounded-sm"></div>
                        <div className="w-2 h-4 bg-red-600 rounded-sm"></div>
                      </div>
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

export default FraudPanel;
