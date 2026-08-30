import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const statusStyles = {
  reported: 'bg-red-100 text-red-700',
  acknowledged: 'bg-yellow-100 text-yellow-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
};

const Home = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchIssues();
  }, []);

  if (loading) return <p className="text-slate-500">Loading issues...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Reported Issues</h2>

      {issues.length === 0 ? (
        <p className="text-slate-500">No issues reported yet.</p>
      ) : (
        <div className="grid gap-4">
          {issues.map((issue) => (
            <Link
              key={issue._id}
              to={`/issues/${issue._id}`}
              className="block bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{issue.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {issue.category} — {issue.location}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${statusStyles[issue.status]}`}
                >
                  {issue.status}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                <span>▲ {issue.upvotes.length}</span>
                <span>💬 {issue.comments.length}</span>
                <span className="ml-auto">by {issue.reportedBy?.name}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;