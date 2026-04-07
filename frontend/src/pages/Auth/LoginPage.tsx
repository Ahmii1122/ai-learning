import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import authService from "../../services/authService";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-50 bg-[#F8F9FA] dark:bg-[#191C1D]">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-semibold text-[#012D1D] dark:text-[#E1E3DF] font-serif">
            Forest Academy
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <nav className="flex gap-6">
              <a
                className="text-[#414942] dark:text-[#C1C8C2] hover:text-[#1B4332] transition-colors duration-300 font-label text-sm tracking-wide"
                href="#"
              >
                Courses
              </a>
              <a
                className="text-[#414942] dark:text-[#C1C8C2] hover:text-[#1B4332] transition-colors duration-300 font-label text-sm tracking-wide"
                href="#"
              >
                Scholarships
              </a>
              <a
                className="text-[#414942] dark:text-[#C1C8C2] hover:text-[#1B4332] transition-colors duration-300 font-label text-sm tracking-wide"
                href="#"
              >
                About
              </a>
            </nav>
            <div className="scale-95 active:opacity-80 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-[#012D1D] dark:text-[#E1E3DF] text-2xl">
                account_circle
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-0 overflow-hidden rounded-xl bg-surface-container-low shadow-sm">
          {/* Left Side: Artistic Graphic (Matches Register Screen) */}
          <div className="relative bg-primary hidden md:flex items-center justify-center p-12 overflow-hidden">
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
                    account_circle
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
                    meeting_room
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="font-headline italic text-3xl text-surface-bright leading-tight">
                  "The mind is not a vessel to be filled, but a fire to be
                  kindled."
                </h2>
                <p className="text-on-primary-container font-label text-sm tracking-wide opacity-80 uppercase">
                  Plutarch • Academic Tradition
                </p>
              </div>
            </div>
            {/* Decorative Image Background Overlay */}
            <div className="absolute inset-0 mix-blend-overlay opacity-30">
              <img
                alt="Library Sanctuary"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqR90eFPOts87VMxAXGdAZhPh11T0nNGAAnFCs0vBTpLIqmjuqs6qiNuJNXoB-PqCQntfOmtSAKCe_KPt4wB2QaghGcxkshYbiTWIPfvgDlZDmpjo_yLU59W4m7JZDI3YVDWsYuKWqq_7EXiNHnEYqneZFg9dKHqziSp8fTc8bdLHJ_gj7DX6DZQEcE3HdxhJpupt_V5N9eaQ_XtPzCM3JAnTJeT8I9X2FyK03DjnyvutxmIGUZ70Ss6sZfIZ-k4oA-oqnh58vouA4"
              />
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="bg-surface-container-lowest p-8 md:p-16 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto space-y-8">
              <div className="space-y-2 text-center md:text-left">
                <span className="font-headline italic text-lg text-primary block">
                  Welcome Back
                </span>
                <h1 className="font-headline text-4xl text-primary font-semibold">
                  Login to your Sanctuary
                </h1>
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
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary-container focus:bg-surface-container-highest transition-all outline-none text-on-surface"
                    id="email"
                    name="email"
                    placeholder="name@academy.edu"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label
                      className="block text-sm font-label font-medium text-on-surface-variant"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <a
                      className="text-xs text-primary font-medium hover:underline font-label"
                      href="#"
                    >
                      Forgot password?
                    </a>
                  </div>
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

                <button
                  className="w-full bg-gradient-to-br from-[#012D1D] to-[#1B4332] text-on-primary font-label font-medium py-4 rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  <span>{loading ? "Signing In..." : "Sign In"}</span>
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
                  <span className="px-4 bg-surface-container-lowest text-on-surface-variant font-label uppercase tracking-widest text-[10px]">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                className="w-full bg-surface-container-low text-on-surface flex items-center justify-center gap-3 py-3 rounded-xl hover:bg-surface-container-highest transition-colors duration-200 border-none"
                type="button"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                <span className="font-label font-medium text-sm">
                  Sign in with Google
                </span>
              </button>

              <p className="mt-8 text-center text-sm text-on-surface-variant font-body">
                Don't have an account?{" "}
                <Link
                  className="text-primary font-semibold hover:underline underline-offset-4"
                  to="/register"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto py-12 bg-[#F3F4F5] dark:bg-[#1C1C1C]">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 gap-6 max-w-7xl mx-auto">
          <div className="text-[#414942] dark:text-[#C1C8C2] font-sans text-sm Inter tracking-wide">
            © 2024 Forest Academy. Cultivating Knowledge.
          </div>
          <div className="flex gap-8">
            <a
              className="text-[#414942] opacity-80 hover:opacity-100 transition-opacity cursor-pointer font-sans text-sm Inter tracking-wide"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-[#414942] opacity-80 hover:opacity-100 transition-opacity cursor-pointer font-sans text-sm Inter tracking-wide"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-[#414942] opacity-80 hover:opacity-100 transition-opacity cursor-pointer font-sans text-sm Inter tracking-wide"
              href="#"
            >
              Academic Integrity
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
