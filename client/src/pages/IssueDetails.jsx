import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const statusStyles = {
  reported: 'bg-red-100 text-red-700',
  acknowledged: 'bg-yellow-100 text-yellow-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
};

const IssueDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');

  const fetchIssue = async () => {
    try {
      const res = await api.get(`/issues/${id}`);
      setIssue(res.data);
    } catch (err) {
      setError('Failed to load issue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const handleUpvote = async () => {
    try {
      await api.post(`/issues/${id}/upvote`);
      fetchIssue();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upvote');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await api.post(`/issues/${id}/comments`, { text: commentText });
      setCommentText('');
      fetchIssue();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;

    try {
      await api.delete(`/issues/${id}`);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete issue');
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!issue) return <p className="text-slate-500">Issue not found.</p>;

  const isOwner = user && issue.reportedBy?._id === user.id;
  const isAdmin = user && user.role === 'admin';
  const canModify = isOwner || isAdmin;
  const hasUpvoted = user && issue.upvotes.includes(user.id);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-800">{issue.title}</h2>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${statusStyles[issue.status]}`}>
            {issue.status}
          </span>
        </div>

        <p className="text-slate-600 mt-3">{issue.description}</p>

        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-sm text-slate-500">
          <span>Category: {issue.category}</span>
          <span>Location: {issue.location}</span>
          <span>Reported by: {issue.reportedBy?.name}</span>
        </div>

        {canModify && (
          <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
            <Link
              to={`/issues/${id}/edit`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        )}

        {user && (
          <button
            onClick={handleUpvote}
            className={`mt-4 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              hasUpvoted
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ▲ {hasUpvoted ? 'Upvoted' : 'Upvote'} ({issue.upvotes.length})
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mt-4">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Comments ({issue.comments.length})
        </h3>

        <div className="space-y-3">
          {issue.comments.map((comment) => (
            <div key={comment._id} className="border-b border-slate-100 pb-3 last:border-0">
              <span className="font-medium text-slate-700">{comment.postedBy?.name || 'Unknown'}</span>
              <p className="text-slate-600 text-sm mt-0.5">{comment.text}</p>
            </div>
          ))}
        </div>

        {user ? (
          <form onSubmit={handleAddComment} className="flex gap-2 mt-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Post
            </button>
          </form>
        ) : (
          <p className="text-slate-500 text-sm mt-4">Log in to comment.</p>
        )}
      </div>
    </div>
  );
};

export default IssueDetails;