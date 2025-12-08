// Password validation utilities
export const getPasswordRequirements = (password) => {
  return {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
};

export const calculatePasswordStrength = (password) => {
  if (!password) return { strength: 0, label: '', color: '' };
  
  const requirements = getPasswordRequirements(password);
  const fulfilledCount = Object.values(requirements).filter(Boolean).length;
  
  if (fulfilledCount <= 2) {
    return { strength: 33, label: 'Weak', color: '#ef4444' };
  } else if (fulfilledCount <= 4) {
    return { strength: 66, label: 'Moderate', color: '#f59e0b' };
  } else {
    return { strength: 100, label: 'Strong', color: '#10b981' };
  }
};

export const isPasswordValid = (password) => {
  const requirements = getPasswordRequirements(password);
  return Object.values(requirements).every(Boolean);
};
