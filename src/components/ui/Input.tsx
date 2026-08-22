import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import Label from "./Label";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      className = "",
      required,
      ...props
    },
    ref,
  ) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            className={cn(
              "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:opacity-60",
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              error
                ? "border-error focus:border-error focus:ring-error/10"
                : "border-neutral-200 focus:border-primary-500 focus:ring-primary-50",
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </span>
          )}
        </div>

        {error ? (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-xs text-red-500"
            role="alert"
          >
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-gray-500 dark:text-white">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
