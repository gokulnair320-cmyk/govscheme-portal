import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, CheckCircle, XCircle } from 'lucide-react';

const AdminDocumentsQueue = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/documents/all');
      setDocuments(res.data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/documents/${id}/verify`, { status });
      // Update local state
      setDocuments(docs => docs.map(d => d.document_id === id ? { ...d, verification_status: status } : d));
    } catch (err) {
      console.error('Error updating document status:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', borderColor: 'rgba(15,76,92,0.1)', borderTopColor: '#0f4c5c' }} />
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading documents...</p>
        </div>
      </div>
    );
  }

  const pendingCount = documents.filter(d => d.verification_status === 'Pending').length;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '2rem', opacity: 0, animation: 'slideUp 0.4s ease-out forwards' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <FileText size={18} color="#0f4c5c" />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0f4c5c', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Verification Queue</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #0f172a, #0f4c5c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Document Verification
        </h1>
        <p style={{ color: '#475569', fontSize: '0.875rem', margin: '0.375rem 0 0' }}>
          Review citizen documents to clear them for scheme application routing.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', opacity: 0, animation: 'slideUp 0.5s ease-out 0.1s forwards' }}>
        <div style={{ flex: 1, padding: '1rem 1.25rem', borderRadius: '12px', background: 'rgba(15, 76, 92, 0.05)', border: '1px solid rgba(15, 76, 92, 0.1)', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(15, 76, 92, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={16} color="#0f4c5c" />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{pendingCount}</div>
            <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.2rem' }}>Pending Verification</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: '1rem 1.25rem', borderRadius: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={16} color="#166534" />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#166534', lineHeight: 1 }}>{documents.length - pendingCount}</div>
            <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.2rem' }}>Processed</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', opacity: 0, animation: 'slideUp 0.5s ease-out 0.2s forwards', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Document DB Code', 'Citizen Name', 'Type', 'Status', 'Actions'].map((h, i) => (
                <th key={h} style={{ padding: '0.875rem 1.5rem', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: i === 4 ? 'right' : 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.document_id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#0f4c5c', background: 'rgba(15, 76, 92, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>{doc.document_id}</span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{doc.citizen_name || 'N/A'}</span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#475569' }}>{doc.document_type}</span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{
                    display: 'inline-flex', padding: '0.25rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700,
                    background: doc.verification_status === 'Pending' ? '#fef08a' : (doc.verification_status === 'Verified' ? '#bbf7d0' : '#fecaca'),
                    color: doc.verification_status === 'Pending' ? '#854d0e' : (doc.verification_status === 'Verified' ? '#166534' : '#991b1b')
                  }}>
                    {doc.verification_status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  {doc.verification_status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleVerify(doc.document_id, 'Verified')} style={{ padding: '0.4rem', border: 'none', background: '#dcfce7', color: '#166534', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => handleVerify(doc.document_id, 'Rejected')} style={{ padding: '0.4rem', border: 'none', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <XCircle size={16} />
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>Processed</span>
                  )}
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                  No documents found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDocumentsQueue;
