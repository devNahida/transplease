import React from 'react';
import LoginForm from '../components/LoginForm';
import { Page } from '../App';

const LoginPage: React.FC<{ onNavigate?: (page: Page) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-dark">
      <LoginForm onNavigate={onNavigate} />
    </div>
  );
};

export default LoginPage; 