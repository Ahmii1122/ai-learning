import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import authService from "../../services/authService";
import toast from "react-hot-toast";
import {
  BrainCircuit,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeClosed,
} from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(email, password);
      const { token, user } = response.data;
      login(user, token);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (err: any) {
      const errormessage =
        err.response?.data?.error || err.message || "Failed to login";
      setError(errormessage);
      toast.error(errormessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md my-4 border border-white/20 rounded-xl p-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/20">
            <BrainCircuit className="h-5 w-5 text-blue-400" />
            <span className="text-white font-semibold">
              AI Learning Assistant
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">
            Sign in to continue to your learning journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className={`relative transition-all duration-300 ${focusedField === "email" ? "scale-105" : ""}`}
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors duration-300">
              <Mail className="h-5 w-5" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              placeholder="Email address"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            />
          </div>

          <div
            className={`relative transition-all duration-300 ${focusedField === "password" ? "scale-105" : ""}`}
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors duration-300">
              <Lock className="h-5 w-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              placeholder="Password"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            />
            {showPassword ? (
              <EyeClosed
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors duration-300"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <Eye
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors duration-300"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-emerald-300 text-white font-semibold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-300"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
