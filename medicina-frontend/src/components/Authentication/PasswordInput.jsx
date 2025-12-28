import React, { useState } from 'react';

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  id,
  labelClassName = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id || name} className={labelClassName}>
          {label}
        </label>
      )}
      <div className="position-relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className="form-control"
          name={name}
          id={id || name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        <button
          type="button"
          className="btn btn-link position-absolute"
          style={{
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            border: 'none',
            background: 'none',
            padding: '0',
            cursor: 'pointer',
            zIndex: 10,
            color: '#6c757d'
          }}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        </button>
      </div>
      {error && (
        <div className="text-sm text-danger">
          {Array.isArray(error) ? error[0] : error}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;


