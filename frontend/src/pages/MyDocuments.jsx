import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Folder, 
  UploadCloud, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  FileText,
  FileImage,
  Upload,
  List
} from 'lucide-react';
import { format, isValid } from 'date-fns';

const MyDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('Aadhar');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/documents/${user.citizenId}`);
        setDocuments(res.data || []);
      } catch (err) {
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.citizenId) fetchDocuments();
  }, [user]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('citizenId', user.citizenId);
    formData.append('documentType', docType);

    try {
      const res = await axios.post('http://localhost:5000/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.document) {
        setDocuments(prev => [...prev, res.data.document]);
      }
      setFile(null);
      alert('Document uploaded successfully!');
    } catch (err) {
      console.error('Error uploading document:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/documents/${id}`);
      setDocuments(documents.filter(d => d.document_id !== id));
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  };

  const getDocIcon = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('image') || t.includes('photo') || t.includes('jpg') || t.includes('png')) {
        return <FileImage size={24} color="#0f4c5c" />;
    }
    return <FileText size={24} color="#0f4c5c" />;
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return isValid(d) ? format(d, 'dd MMM yyyy') : 'Recently';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', opacity: 0, animation: 'slideUp 0.5s ease-out forwards' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Folder size={18} color="#0f4c5c" />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0f4c5c', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Security</span>
        </div>
        <h1 style={{ 
            fontSize: '2.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #0f172a, #0f4c5c)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
        }}>Document Vault</h1>
        <p style={{ color: '#475569', fontSize: '1rem', marginTop: '0.5rem' }}>Securely manage your uploaded certificates and proofs.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        {/* Upload Section */}
        <div style={{
          flex: '1 1 350px',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          padding: '2rem',
          opacity: 0,
          animation: 'slideUp 0.5s ease-out 0.1s forwards',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UploadCloud size={20} color="#0f4c5c" /> Upload New
          </h2>
          
          <form onSubmit={handleUpload}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0',
                  borderRadius: '10px', fontSize: '0.9rem', color: '#1e293b', outline: 'none', cursor: 'pointer'
                }}
              >
                <option value="Aadhar">Aadhar Card</option>
                <option value="PAN">PAN Card</option>
                <option value="Income Certificate">Income Certificate</option>
                <option value="Caste Certificate">Caste Certificate</option>
                <option value="Ration Card">Ration Card</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Select File</label>
              <div style={{
                border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '2rem', textAlign: 'center',
                background: '#f8fafc', cursor: 'pointer', transition: 'all 0.2s',
                position: 'relative', overflow: 'hidden'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0f4c5c'; e.currentTarget.style.background = '#f0fdfa'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
              >
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                  required
                />
                <Upload size={32} color={file ? '#10b981' : '#94a3b8'} style={{ margin: '0 auto 1rem' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: file ? '#047857' : '#475569', margin: '0 0 0.25rem' }}>
                  {file ? file.name : 'Click to select file'}
                </p>
                <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>
                  PDF, JPG, PNG up to 5MB
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || !file}
              className="btn-gradient"
              style={{
                width: '100%', padding: '0.875rem', borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem'
              }}
            >
              {uploading ? 'Uploading...' : 'Verify & Upload'}
            </button>
          </form>
        </div>

        {/* Document List Section */}
        <div style={{ flex: '2 1 400px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: '0 0 1.5rem', opacity: 0, animation: 'slideUp 0.5s ease-out 0.2s forwards' }}>
            My Records ({documents.length})
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {documents.map((doc, idx) => (
              <div
                key={doc.document_id || idx}
                className="doc-card"
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  opacity: 0,
                  animation: `slideUp 0.5s ease-out ${0.2 + idx * 0.05}s forwards`,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'rgba(15, 76, 92, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {getDocIcon(doc.document_type)}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {doc.document_type}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem' }}>
                    <span style={{ 
                        color: doc.verification_status === 'Pending' ? '#854d0e' : (doc.verification_status === 'Verified' ? '#059669' : '#b91c1c'),
                        display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700 
                    }}>
                      {doc.verification_status === 'Pending' && <AlertCircle size={10} />}
                      {doc.verification_status === 'Verified' && <CheckCircle size={10} />}
                      {doc.verification_status === 'Rejected' && <Trash2 size={10} />}
                      {doc.verification_status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(doc.document_id)}
                  style={{
                    width: '32px', height: '32px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                  }}
                  title="Delete Document"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {documents.length === 0 && (
            <div style={{ 
              textAlign: 'center', padding: '4rem 2rem', background: '#ffffff', borderRadius: '20px', 
              border: '1px dashed #e2e8f0', opacity: 0, animation: 'slideUp 0.5s ease-out 0.3s forwards'
            }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                 <AlertCircle size={32} color="#cbd5e1" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>Vault Empty</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '280px', margin: '0 auto' }}>
                You haven't uploaded any documents yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDocuments;
