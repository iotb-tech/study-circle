import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import Label from './Label';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, required, id, className, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={textareaId} required={required}>
            {label}
          </Label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          className={cn(
            'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:opacity-60 resize-y min-h-[100px]',
            error
              ? 'border-error focus:border-error focus:ring-error/10'
              : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-50',
            className
          )}
          {...props}
        />

        {error ? (
          <p id={`${textareaId}-error`} className="mt-1.5 text-xs text-error" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${textareaId}-helper`} className="mt-1.5 text-xs text-neutral-600">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;