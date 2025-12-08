import React from 'react';
import { getPasswordRequirements } from '../../utils/passwordValidation';

const PasswordRequirements = ({ password, passwordStrength }) => {
  const requirements = getPasswordRequirements(password);
  const allMet = Object.values(requirements).every(Boolean);

  return (
    <div className="password-requirements-compact">
      {/* Strength Indicator */}
      <div className={`requirement-item ${allMet ? 'success' : 'error'}`}>
        <span className="req-icon">{allMet ? '✓' : '✗'}</span>
        <span>Password strength: <strong>{passwordStrength.label || 'weak'}</strong></span>
      </div>
      
      {/* Individual Requirements */}
      <div className={`requirement-item ${requirements.minLength ? 'success' : 'pending'}`}>
        <span className="req-icon">✓</span>
        <span>At least 8 characters</span>
      </div>
      
      <div className={`requirement-item ${requirements.hasUpperCase ? 'success' : 'pending'}`}>
        <span className="req-icon">✓</span>
        <span>One uppercase letter (A-Z)</span>
      </div>
      
      <div className={`requirement-item ${requirements.hasLowerCase ? 'success' : 'pending'}`}>
        <span className="req-icon">✓</span>
        <span>One lowercase letter (a-z)</span>
      </div>
      
      <div className={`requirement-item ${requirements.hasNumber ? 'success' : 'pending'}`}>
        <span className="req-icon">✓</span>
        <span>One number (0-9)</span>
      </div>
      
      <div className={`requirement-item ${requirements.hasSpecialChar ? 'success' : 'pending'}`}>
        <span className="req-icon">✓</span>
        <span>Contains special character (!@#$%^&*)</span>
      </div>
    </div>
  );
};

export default PasswordRequirements;
