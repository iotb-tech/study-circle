import type { FormHTMLAttributes, ReactNode } from "react";
import type {
  // FieldErrors,
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

interface FormProps<TFieldValues extends FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "onInvalid"> {
  children: ReactNode;
  methods: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  onInvalid?: SubmitErrorHandler<TFieldValues>;
}

const Form = <TFieldValues extends FieldValues>({
  children,
  methods,
  onSubmit,
  onInvalid,
  className = "",
  ...props
}: FormProps<TFieldValues>) => {
  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit, onInvalid)}
      noValidate
      className={`w-full ${className}`}
      {...props}
    >
      {children}
    </form>
  );
};

export default Form;