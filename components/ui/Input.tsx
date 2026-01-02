
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-slate-700/50 border border-slate-600 rounded-md shadow-sm px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
      />
    </div>
  );
};

export default Input;
