import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const SchemeList = () => {
  const { user } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/schemes');
        setSchemes(res.data);
      } catch (err) {
        console.error('Error fetching schemes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  const handleApply = async (schemeId) => {
    setApplying(schemeId);
    setMessage(null);
    try {
      const res = await axios.post('http://localhost:5000/api/applications', {
        citizenId: user.citizenId,
        schemeId
      });
      
      const { eligibilityResult, remarks, status } = res.data;
      
      if (eligibilityResult === 'Eligible') {
        setMessage({ type: 'success', text: `Success! Application submitted. Status: ${status}` });
      } else {
        setMessage({ type: 'error', text: `Failed! Eligibility: ${remarks}` });
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setMessage({ type: 'error', text: 'You have already applied for this scheme.' });
      } else {
        setMessage({ type: 'error', text: 'An error occurred while applying.' });
      }
    } finally {
      setApplying(null);
      // clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  if (loading) return <div className="flex justify-center h-64 items-center">Loading schemes...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Available Schemes</h1>
        <p className="mt-2 text-slate-600">Browse and apply for government schemes you are eligible for.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle2 className="mr-2 h-5 w-5" /> : <AlertCircle className="mr-2 h-5 w-5" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.map((scheme) => (
          <div key={scheme.schemeId} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-navy-900 px-6 py-4">
              <h2 className="text-xl font-bold text-white">{scheme.name}</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mb-6">
                <div>
                  <p className="text-slate-500">Age Range</p>
                  <p className="font-semibold text-slate-900">{scheme.age_lower} - {scheme.age_upper} years</p>
                </div>
                <div>
                  <p className="text-slate-500">Income Limit</p>
                  <p className="font-semibold text-slate-900">₹{scheme.income.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-500">Gender</p>
                  <p className="font-semibold text-slate-900 capitalize">{scheme.gender}</p>
                </div>
                <div>
                  <p className="text-slate-500">Caste Category</p>
                  <p className="font-semibold text-slate-900 capitalize">{scheme.caste}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-500">Required Document</p>
                  <p className="font-semibold text-slate-900 capitalize">{scheme.required_document}</p>
                </div>
              </div>
              
              <button
                onClick={() => handleApply(scheme.schemeId)}
                disabled={applying === scheme.schemeId}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {applying === scheme.schemeId ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Apply Now'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemeList;
