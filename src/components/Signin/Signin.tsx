// src/components/Signin/Signin.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import Form from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { signinSchema, type SigninFormData } from "@/types/auth";
import Spinner from "../ui/Spinner";

export default function Signin() {
  const supabase = createClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState({
    email: false,
    password: false,
  });

  const methods = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register,
    clearErrors,
    formState: { errors, isSubmitting },
  } = methods;

  const handleFieldChange = (field: keyof SigninFormData) => {
    clearErrors(field);
    setServerError(null);
    setShowErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleInvalidSubmit = () => {
    setShowErrors({
      email: true,
      password: true,
    });
  };

  const handleSignin = async (data: SigninFormData) => {
    // setShowErrors({ email: true, password: true });

    try {
      setServerError(null);

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setServerError("Invalid email or password. Please try again.");
        } else {
          setServerError(authError.message);
        }
        return;
      }

      // window.location.href = "/dashboard";
      setTimeout(() => {
      window.location.replace("/dashboard");
    }, 300);
    } catch (error) {
      console.error("Signin error:", error);
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <Form
        methods={methods}
        onSubmit={handleSignin}
        onInvalid={handleInvalidSubmit}
        className="space-y-4"
      >
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          className="py-4"
          error={showErrors.email ? errors.email?.message : undefined}
          required
          {...register("email", {
            onChange: () => handleFieldChange("email"),
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          className="py-4"
          error={showErrors.password ? errors.password?.message : undefined}
          required
          {...register("password", {
            onChange: () => handleFieldChange("password"),
          })}
        />

        {serverError && (
          <div
            className="rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-sm text-error"
            role="alert"
          >
            {serverError}
          </div>
        )}

        <Button
          type="submit"
          loading={isSubmitting}
          loadingText="Signing in..."
          className="w-full py-4 text-base cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="text-white" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </Form>
    </div>
  );
}
