import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault(); setError('');
    try {
      const res = await axios.post(`${API}/api/auth/login`, form);
      login(res.data.token, { name: res.data.name, userId: res.data.userId });
      navigate('/dashboard');
    } catch (err) { setError(err.response?.data?.message || 'Login failed'); }
  };
  return (
    <div className="container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Email</label><input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required /></div>
        <div className="form-group"><label>Password</label><input name="password" type="password" placeholder="Your password" value={form.password} onChange={handleChange} required /></div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <div className="link">No account? <Link to="/register">Register</Link></div>
    </div>
  );
}
