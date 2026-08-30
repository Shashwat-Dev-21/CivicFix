import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const statusStyles = {
  reported: 'bg-red-100 text-red-700',
  acknowledged: 'bg-yellow-100 text-yellow-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
};

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchIssues = async () => {
    try {
      const res = await api.get('/issues');
      setIssues(res.data);
    } catch (err) {
      setError('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await api.put(`/issues/${issueId}`, { status: newStatus });
      fetchIssues();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
        <p className="text-sm text-slate-500">Total issues: {issues.length}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-500 border-b border-slate-200">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Reported By</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Change Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-800 font-medium">{issue.title}</td>
                <td className="px-4 py-3 text-slate-600">{issue.category}</td>
                <td className="px-4 py-3 text-slate-600">{issue.reportedBy?.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[issue.status]}`}>
                    {issue.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={issue.status}
                    onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                    className="border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="reported">Reported</option>
                    <option value="acknowledged">Acknowledged</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <Link to={`/issues/${issue._id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;