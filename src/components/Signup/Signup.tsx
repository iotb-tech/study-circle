"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import Form from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

type SignupFormData = z.infer<typeof signupSchema>;

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

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ display_name: data.name })
        .eq("id", authData.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
      }

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
        {/* Name field */}
        <Input
          label="Full Name"
          placeholder="Enter you full name..."
          error={errors.name?.message}
          required
          {...register("name")}
        />

        {/* Email field */}
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          required
          {...register("email")}
        />

        {/* Password field */}
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          helperText="At least 8 characters with uppercase, lowercase, and number"
          required
          {...register("password")}
        />

        {/* Server error message */}
        {serverError && (
          <div
            className="rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-sm text-error"
            role="alert"
          >
            {serverError}
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          loading={isSubmitting}
          loadingText="Creating account..."
          className="w-full"
        >
          Create Account
        </Button>
      </Form>
    </div>
  );
}