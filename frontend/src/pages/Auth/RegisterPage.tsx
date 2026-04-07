import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match");
      toast.error("Password and Confirm Password do not match");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      await authService.register(username, email, password);
      toast.success("Registered successfully");
      navigate("/login");
    } catch (error: any) {
      const errormessage =
        error.response?.data?.error || error.message || "Failed to register";
      setError(errormessage);
      toast.error(errormessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface text-on-surface font-body flex items-center justify-center py-12 px-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-0 overflow-hidden rounded-xl bg-surface-container-low shadow-sm">
        {/* Left Side: Artistic Graphic */}
        <div className="relative bg-primary hidden md:flex items-center justify-center p-12 overflow-hidden">
          {/* Abstract organic elements */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg
              className="w-full h-full"
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" fill="#a5d0b9" r="100"></circle>
              <path
                d="M300,100 Q350,200 300,300 T200,350"
                fill="transparent"
                stroke="#a5d0b9"
                strokeWidth="2"
              ></path>
            </svg>
          </div>
          <div className="relative z-10 text-center space-y-8">
            <div className="flex justify-center">
              <div className="bg-[rgba(248,249,250,0.8)] backdrop-blur-md p-8 rounded-xl flex flex-col items-center gap-4 max-w-xs shadow-lg">
                <span
                  className="material-symbols-outlined text-primary-container text-5xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  description
                </span>
                <div className="flex gap-2">
                  <span className="material-symbols-outlined text-on-primary-container animate-pulse">
                    keyboard_double_arrow_right
                  </span>
                </div>
                <span
                  className="material-symbols-outlined text-primary-container text-5xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  eco
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="font-headline italic text-3xl text-surface-bright leading-tight">
                The seed of understanding starts with a single page.
              </h2>
              <p className="text-on-primary-container font-label text-sm tracking-wide opacity-80 uppercase">
                AI Learning Sanctuary
              </p>
            </div>
          </div>
          {/* Decorative Image Background Overlay */}
          <div className="absolute inset-0 mix-blend-overlay opacity-30">
            <img
              alt="Close-up of vibrant green ferns"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSbPbFdk23JIOs5FpsNBMkaFmDmmsGX-QalljAv5pbECgOOYjB-5r67Djanf35mWVfqI_vMcuW0mZTscXmXkYHsJ4ExxVOhkGWyUTYeKPdXXMLlnfYV9rkrfD7GKlo3isNVfMrL8jKg0MYi4dIZ3ctMlZy5jMHe2lwMrz2FY4uKjx7CwdyQ4nS_yjIzA83r4C3hAOrj0qVL1PS56Mp9SrSP85a9LbUOQ8FUGunJBEKRY3zbtDMB8XKLXnuVZgXxeg3A3fpAvusFbKC"
            />
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="bg-surface-container-lowest p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div className="space-y-2 text-center md:text-left">
              <h1 className="font-headline text-4xl text-primary font-semibold">
                Join the Academy
              </h1>
              <p className="text-on-surface-variant font-body">
                Begin your journey toward intellectual mastery.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500 text-sm animate-fade-in">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label
                  className="block text-sm font-label font-medium text-on-surface-variant"
                  htmlFor="full_name"
                >
                  Full Name
                </label>
                <input
                  className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary-container focus:bg-surface-container-highest transition-all outline-none text-on-surface"
                  id="full_name"
                  name="full_name"
                  placeholder="Elias Thorne"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className="block text-sm font-label font-medium text-on-surface-variant"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary-container focus:bg-surface-container-highest transition-all outline-none text-on-surface"
                  id="email"
                  name="email"
                  placeholder="elias@academy.edu"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    className="block text-sm font-label font-medium text-on-surface-variant"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary-container focus:bg-surface-container-highest transition-all outline-none text-on-surface"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    className="block text-sm font-label font-medium text-on-surface-variant"
                    htmlFor="confirm_password"
                  >
                    Confirm Password
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary-container focus:bg-surface-container-highest transition-all outline-none text-on-surface"
                    id="confirm_password"
                    name="confirm_password"
                    placeholder="••••••••"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <div className="flex items-center h-5">
                  <input
                    className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary-container"
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                  />
                </div>
                <label
                  className="text-sm text-on-surface-variant font-body"
                  htmlFor="terms"
                >
                  I agree to the{" "}
                  <a
                    className="text-primary font-medium underline underline-offset-4 decoration-outline-variant hover:decoration-primary transition-all"
                    href="#"
                  >
                    Terms of Service
                  </a>{" "}
                  and Academic Integrity standards.
                </label>
              </div>

              <button
                className="w-full bg-gradient-to-br from-[#012D1D] to-[#1B4332] text-on-primary font-label font-medium py-4 rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                <span>
                  {loading ? "Creating Account..." : "Create Account"}
                </span>
                {!loading && (
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                )}
              </button>
            </form>

            <div className="relative pt-4">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-outline-variant opacity-20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface-container-lowest text-on-surface-variant font-label">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="text-center">
              <Link
                className="font-label text-primary font-semibold hover:opacity-70 transition-opacity"
                to="/login"
              >
                Log in to your study
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
