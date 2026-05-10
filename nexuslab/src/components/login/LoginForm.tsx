import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import '../styles_module/logi';


type LoginResponse = {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
};

export function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      setMessage(errorData.message || 'Login failed!');
      return;
    }

    const data = (await response.json()) as LoginResponse;
    localStorage.setItem('userId', String(data.userId));
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('firstName', data.firstName);
    localStorage.setItem('lastName', data.lastName);
    window.dispatchEvent(new Event('auth:changed'));
    setMessage(`Login successful for ${data.firstName} ${data.lastName}`);
    navigate('/profile');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input
        name="password"
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={handleChange}
      />
      <button className="button" type="submit">Login</button>
      <p>{message}</p>
    </form>
  );
}