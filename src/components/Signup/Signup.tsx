// src/components/Signup/Signup.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import Form from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { signupSchema, type SignupFormData } from "@/types/auth";

export default function Signup() {
  const router = useRouter();
  const supabase = createClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const methods = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const {
    register,
    formState: { errors, isSubmitting },
  } = methods;

  const handleSignup = async (data: SignupFormData) => {
    try {
      setServerError(null);

      // Step 1: Create the user in Supabase Auth
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

      // Step 2: Update the profile with the display name
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ display_name: data.name })
        .eq("id", authData.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        // Don't block signup if profile update fails
      }

      // Step 3: Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Signup error:", error);
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <Form methods={methods} onSubmit={handleSignup} className="space-y-4">
        <Input
          label="Full Name"
          className="py-4"
          placeholder="e.g., Ibrahim Ibrahim"
          error={errors.name?.message}
          required
          {...register("name")}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          className="py-4"
          error={errors.email?.message}
          required
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          className="py-4"
          error={errors.password?.message}
          helperText="At least 8 characters with uppercase, lowercase, and number"
          required
          {...register("password")}
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
          Create Account
        </Button>
      </Form>
    </div>
  );
}