import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://192.168.0.35:5000';
export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      await axios.post(`${API}/api/auth/register`, form);
      setSuccess('Registered! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
  };
  return (
    <div className="container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Full Name</label><input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required /></div>
        <div className="form-group"><label>Email</label><input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required /></div>
        <div className="form-group"><label>Password</label><input name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} /></div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">Register</button>
      </form>
      <div className="link">Already have an account? <Link to="/login">Login</Link></div>
    </div>
  );
}
