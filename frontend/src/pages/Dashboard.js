import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const API = process.env.REACT_APP_API_URL || 'http://192.168.0.35:5000';
export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [form, setForm] = useState({ phone: '', twelfth_percent: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const headers = { Authorization: `Bearer ${token}` };
  useEffect(() => {
    axios.get(`${API}/api/details`, { headers })
      .then(res => { setDetails(res.data); setForm({ phone: res.data.phone || '', twelfth_percent: res.data.twelfth_percent || '' }); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault(); setMessage(''); setError('');
    try {
      await axios.post(`${API}/api/details`, { phone: form.phone, twelfth_percent: parseFloat(form.twelfth_percent) }, { headers });
      setMessage('Details saved successfully!');
      const res = await axios.get(`${API}/api/details`, { headers });
      setDetails(res.data);
    } catch (err) { setError(err.response?.data?.message || 'Failed to save'); }
  };
  const handleLogout = () => { logout(); navigate('/login'); };
  if (loading) return <div className="dashboard"><p>Loading...</p></div>;
  return (
    <div className="dashboard">
      <h2>Hello, {user?.name}</h2>
      <p className="subtitle">Manage your profile details below</p>
      {details?.phone && (
        <div className="info-card">
          <div className="row"><span>Name</span><span>{details.name}</span></div>
          <div className="row"><span>Email</span><span>{details.email}</span></div>
          <div className="row"><span>Phone</span><span>{details.phone}</span></div>
          <div className="row"><span>12th %</span><span>{details.twelfth_percent}%</span></div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Phone Number</label><input name="phone" placeholder="9876543210" value={form.phone} onChange={handleChange} required /></div>
        <div className="form-group"><label>12th Percentage</label><input name="twelfth_percent" type="number" placeholder="85.5" min="0" max="100" step="0.01" value={form.twelfth_percent} onChange={handleChange} required /></div>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <button type="submit">Save Details</button>
      </form>
      <button className="logout-btn" onClick={handleLogout} style={{marginTop:'16px'}}>Logout</button>
    </div>
  );
}
