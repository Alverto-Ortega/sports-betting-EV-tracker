
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, children, ...props }) => {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <select
        {...props}
        className="w-full bg-slate-700/50 border border-slate-600 rounded-md shadow-sm px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
