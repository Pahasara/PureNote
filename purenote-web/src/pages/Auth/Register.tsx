import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { RegisterDto } from "@/types/auth.types";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [formData, setFormData] = useState<RegisterDto>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register(formData);
      setAuth(response.token, {
        email: response.email,
        username: response.username,
        firstName: response.firstName,
        lastName: response.lastName,
      });
      navigate("/dashboard");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-linear-to-br from-neon-blue/10 via-transparent to-neon-purple/10" />

      <div className="glass rounded-2xl p-8 w-full max-w-md relative z-10 animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-8">
          <BookOpen className="w-8 h-8 text-neon-blue" />
          <h1 className="text-2xl font-bold">
            Pure<span className="text-neon-blue">Note</span>
          </h1>
        </div>

        <h2 className="text-xl font-semibold mb-6 text-center">
          Create your account
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            name="username"
            type="text"
            placeholder="batman"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="bruce@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              type="text"
              placeholder="Bruce"
              value={formData.firstName}
              onChange={handleChange}
            />
            <Input
              label="Last Name"
              name="lastName"
              type="text"
              placeholder="Wayne"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full mt-6!"
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-blue hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
