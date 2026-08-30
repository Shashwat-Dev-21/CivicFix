import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const inputClass =
  'w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';

const EditIssue = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'pothole',
    location: '',
    imageUrl: '',
    status: 'reported',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await api.get(`/issues/${id}`);
        setFormData({
          title: res.data.title,
          description: res.data.description,
          category: res.data.category,
          location: res.data.location,
          imageUrl: res.data.imageUrl || '',
          status: res.data.status,
        });
      } catch (err) {
        setError('Failed to load issue');
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.put(`/issues/${id}`, formData);
      navigate(`/issues/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update issue');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;

  const isAdmin = user && user.role === 'admin';

  return (
    <div className="max-w-lg mx-auto mt-4">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-5">Edit Issue</h2>

        {error && (
          <p className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className={inputClass}
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="pothole">Pothole</option>
            <option value="garbage">Garbage</option>
            <option value="streetlight">Streetlight</option>
            <option value="water">Water</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className={inputClass}
          />

          {isAdmin && (
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="reported">Reported</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded-md text-sm font-medium transition-colors"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditIssue;