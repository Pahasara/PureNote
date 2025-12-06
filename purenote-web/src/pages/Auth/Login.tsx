import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { LoginDto } from "@/types/auth.types";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [formData, setFormData] = useState<LoginDto>({
    identifier: "",
    password: "",
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
    setIsLoading(true);

    try {
      const response = await authService.login(formData);
      setAuth(response.token, {
        email: response.email,
        username: response.username,
        firstName: response.firstName,
        lastName: response.lastName,
      });
      navigate("/dashboard");
    } catch (err: any) {
      const message = err.response?.data?.message || "Invalid credentials";
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

        <h2 className="text-xl font-semibold mb-6 text-center">Welcome back</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email or Username"
            name="identifier"
            type="text"
            placeholder="batman@example.com"
            value={formData.identifier}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full mt-6!"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary-blue hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
