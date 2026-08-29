import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const IssueDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!issue) return <p>Issue not found.</p>;

  const hasUpvoted = user && issue.upvotes.includes(user.id);

  return (
    <div>
      <h2>{issue.title}</h2>
      <p>{issue.description}</p>
      <p>Category: {issue.category}</p>
      <p>Location: {issue.location}</p>
      <p>Status: {issue.status}</p>
      <p>Reported by: {issue.reportedBy?.name}</p>

      {user && (
        <button onClick={handleUpvote}>
          {hasUpvoted ? 'Remove Upvote' : 'Upvote'} ({issue.upvotes.length})
        </button>
      )}

      <h3>Comments ({issue.comments.length})</h3>
      {issue.comments.map((comment) => (
        <div key={comment._id}>
          <strong>{comment.postedBy?.name || 'Unknown'}:</strong> {comment.text}
        </div>
      ))}

      {user ? (
        <form onSubmit={handleAddComment}>
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
          />
          <button type="submit">Post</button>
        </form>
      ) : (
        <p>Log in to comment.</p>
      )}
    </div>
  );
};

export default IssueDetails;