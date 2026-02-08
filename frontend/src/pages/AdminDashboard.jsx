import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch appeals from backend
  const fetchAppeals = async () => {
    try {
      const res = await axios.get('http://localhost:8000/appeals');
      setAppeals(res.data);
    } catch (err) {
      console.error("Failed to fetch appeals", err);
    }
  };

  useEffect(() => {
    fetchAppeals();
  }, []);

  const handleApprove = async (claimId) => {
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:8000/approve_appeal/${claimId}`);
      if(res.data.status === "success") {
        alert(`✅ Approved! Tx Hash: ${res.data.tx_hash}`);
        fetchAppeals(); // Refresh list
      } else {
        alert("❌ Blockchain Error: " + res.data.message);
      }
    } catch (err) {
      alert("❌ Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-purple-400 border-b border-gray-700 pb-4">
          🏛️ DAO Governance Console
        </h1>

        {appeals.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-xl text-gray-400">No Pending Appeals. All clean.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {appeals.map((claim) => (
              <div key={claim.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex flex-col md:flex-row gap-6 items-center">
                {/* Image */}
                <div className="w-full md:w-64 h-48 bg-black rounded overflow-hidden">
                  <img 
                    src={claim.image_url} 
                    alt="Damaged Item" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-grow space-y-2">
                  <h3 className="text-2xl font-bold text-white">{claim.item}</h3>
                  <div className="inline-block bg-red-900 text-red-200 px-3 py-1 rounded text-sm font-bold">
                    REJECTED BY AI
                  </div>
                  <p className="text-gray-300">Reason: <span className="italic">{claim.reason}</span></p>
                  <p className="text-purple-300 font-bold text-xl">Amount: ${claim.amount}</p>
                </div>

                {/* Action */}
                <button
                  onClick={() => handleApprove(claim.id)}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "⚖️ OVERRIDE & PAY"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;