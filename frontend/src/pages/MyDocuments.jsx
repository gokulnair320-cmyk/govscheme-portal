import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Database, CheckCircle, Clock } from 'lucide-react';

const MyDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/documents/${user.citizenId}`);
        setDocuments(res.data);
      } catch (err) {
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.citizenId) fetchDocuments();
  }, [user]);

  if (loading) return <div className="flex justify-center h-64 items-center">Loading documents...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Documents</h1>
        <p className="mt-2 text-slate-600">View and manage your registered verification documents.</p>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
        {documents.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center">
            <Database className="h-12 w-12 text-slate-300 mb-3" />
            <p>No documents found on record.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-sm">
                  <th className="px-6 py-4 font-semibold">Doc ID</th>
                  <th className="px-6 py-4 font-semibold">Document Type</th>
                  <th className="px-6 py-4 font-semibold">Document Number</th>
                  <th className="px-6 py-4 font-semibold text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {documents.map((doc) => (
                  <tr key={doc.document_id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-500">{doc.document_id}</td>
                    <td className="px-6 py-4 font-semibold">{doc.document_type}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                        {doc.document_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {doc.verification_status === 'Verified' ? (
                        <span className="inline-flex items-center text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md text-xs font-semibold">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5 mr-1" /> Pending
                        </span>
                      )}
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

export default MyDocuments;
