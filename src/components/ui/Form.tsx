import type { FormHTMLAttributes, ReactNode } from "react";
import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

interface FormProps<TFieldValues extends FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  children: ReactNode;
  methods: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
}

const Form = <TFieldValues extends FieldValues>({
  children,
  methods,
  onSubmit,
  className = "",
  ...props
}: FormProps<TFieldValues>) => {
  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      noValidate
      className={`w-full ${className}`}
      {...props}
    >
      {children}
    </form>
  );
};

export default Form;