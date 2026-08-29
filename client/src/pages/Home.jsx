import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

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

  if (loading) return <p>Loading issues...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Reported Issues</h2>
      {issues.length === 0 ? (
        <p>No issues reported yet.</p>
      ) : (
        issues.map((issue) => (
          <div key={issue._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
            <h3>
              <Link to={`/issues/${issue._id}`}>{issue.title}</Link>
            </h3>
            <p>{issue.category} — {issue.location}</p>
            <p>Status: {issue.status}</p>
            <p>Reported by: {issue.reportedBy?.name}</p>
            <p>Upvotes: {issue.upvotes.length} | Comments: {issue.comments.length}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;