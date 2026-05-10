import React from 'react';
import '../styles_module/register.css';
import { LoginForm } from './login/LoginForm';

export function LoginPage() {
  return (
    <div>
      <div className="clip" />
      <div className="form">
        <h2>Login</h2>
        <LoginForm />
      </div>
    </div>
  );
}
