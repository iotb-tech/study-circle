// src/components/Signup/Signup.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import Form from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { signupSchema, type SignupFormData } from "@/types/auth";
import Spinner from "../ui/Spinner";

export default function Signup() {
  const supabase = createClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState({
    name: false,
    email: false,
    password: false,
  });

  const methods = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const {
    register,
    clearErrors,
    formState: { errors, isSubmitting },
  } = methods;

  const handleFieldChange = (field: keyof SignupFormData) => {
    clearErrors(field);
    setShowErrors((prev) => ({ ...prev, [field]: false }));
    setServerError(null);
  };

  const handleInvalidSubmit = () => {
    setShowErrors({
        name: true,
        email: true,
        password: true,
    });
    };

  const handleSignup = async (data: SignupFormData) => {
    // setShowErrors({ name: true, email: true, password: true });

    try {
      setServerError(null);

      // Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.name,
          },
        },
      });

      if (authError) {
        setServerError(authError.message);
        return;
      }

      if (!authData.user) {
        setServerError("Something went wrong. Please try again.");
        return;
      }

      // Update the profile with the display name
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ display_name: data.name })
        .eq("id", authData.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        // Don't block signup if profile update fails
      }

      // window.location.href = "/dashboard";
      setTimeout(() => {
      window.location.replace("/dashboard");
    }, 300);
    } catch (error) {
      console.error("Signup error:", error);
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <Form methods={methods} onSubmit={handleSignup} onInvalid={handleInvalidSubmit} className="space-y-4">
        <Input
          label="Full Name"
          className="py-4"
          placeholder="e.g., Enter your full name..."
          error={showErrors.name ? errors.name?.message : undefined}
          required
          {...register("name", {
            onChange: () => handleFieldChange("name"),
          })}
        />

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
          helperText="At least 8 characters with uppercase, lowercase, and number"
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
          loadingText="Creating account..."
          className="w-full py-4 text-base cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="text-white" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </Form>
    </div>
  );
}
