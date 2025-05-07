import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/register', form);
      alert('Registered successfully!');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <input
        type="password"
        name="password_confirmation"
        placeholder="Confirm Password"
        onChange={handleChange}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
