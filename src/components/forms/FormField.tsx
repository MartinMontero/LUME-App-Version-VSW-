import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { cn } from '../../utils';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  help?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  help,
  children,
  className,
}) => {
  return (
    <div className={cn('form-group', className)}>
      <label className={cn('form-label', required && 'required')}>
        {label}
      </label>
      {children}
      {help && <div className="form-help">{help}</div>}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({
  icon: Icon,
  error,
  className,
  ...props
}) => {
  if (Icon) {
    return (
      <div className="input-with-icon">
        <input
          className={cn('input-field', error && 'error', className)}
          {...props}
        />
        <Icon className="input-icon" />
      </div>
    );
  }

  return (
    <input
      className={cn('input-field', error && 'error', className)}
      {...props}
    />
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  error,
  className,
  ...props
}) => {
  return (
    <textarea
      className={cn('textarea-field', error && 'error', className)}
      {...props}
    />
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  error,
  options,
  className,
  ...props
}) => {
  return (
    <select
      className={cn('select-field', error && 'error', className)}
      {...props}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};