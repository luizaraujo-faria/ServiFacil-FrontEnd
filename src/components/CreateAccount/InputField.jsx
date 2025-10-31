import React from 'react';

function InputField({ label, error, className = '', type = 'text', ...props }) {
  const baseClasses = type === 'checkbox' ? 'accent-yellow-500 h-4 w-4' : 'border rounded-lg px-4 py-2 w-full focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300';

  const errorClasses = type === 'checkbox' ? '' : error ? 'border-red-500 focus:border-red-500 focus:ring-red-300' : 'border-gray-300';

  return (
    <div className={`flex flex-col space-y-1 flex-1 ${type === 'checkbox' ? '' : ''}`}>
      {type === 'checkbox' ? (
        <label className={`flex items-center space-x-2 ${className}`}>
          <input type="checkbox" {...props} className={baseClasses} />
          <span className="text-sm text-gray-700">{label}</span>
        </label>
      ) : (
        <>
          {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
          <input type={type} {...props} className={`${baseClasses} ${errorClasses} ${className}`} />
        </>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

export default InputField;
