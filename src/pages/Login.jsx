import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, GraduationCap, BookOpen, Users, ArrowLeft, LogIn } from "lucide-react";

const getHomeRouteForRole = (roleId) => {
  if (roleId === "student") return "/student";
  return "/";
};

const roles = [
  {
    id: "admin",
    label: "Admin",
    icon: ShieldCheck,
    color: "from-indigo-500 to-blue-600",
    shadow: "shadow-indigo-500/25",
    ring: "ring-indigo-400",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    btnBg: "bg-indigo-600 hover:bg-indigo-700",
    description: "System administration & management",
  },
  {
    id: "student",
    label: "Student",
    icon: GraduationCap,
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/25",
    ring: "ring-emerald-400",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    btnBg: "bg-emerald-600 hover:bg-emerald-700",
    description: "Access courses & track progress",
  },
  {
    id: "teacher",
    label: "Teacher",
    icon: BookOpen,
    color: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/25",
    ring: "ring-amber-400",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    btnBg: "bg-amber-600 hover:bg-amber-700",
    description: "Manage classes & grade students",
  },
  {
    id: "parent",
    label: "Parent",
    icon: Users,
    color: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/25",
    ring: "ring-violet-400",
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
    btnBg: "bg-violet-600 hover:bg-violet-700",
    description: "Monitor your child's performance",
  },
];

const Login = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setUsername("");
    setPassword("");
    setError("");
  };

  const handleBack = () => {
    setSelectedRole(null);
    setUsername("");
    setPassword("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Demo credentials check (in production, replace with real API call)
    const validCredentials = {
      admin: { username: "admin", password: "admin123" },
      student: { username: "student", password: "student123" },
      teacher: { username: "teacher", password: "teacher123" },
      parent: { username: "parent", password: "parent123" },
    };

    const creds = validCredentials[selectedRole.id];
    if (username === creds.username && password === creds.password) {
      onLogin(selectedRole.id);
      navigate(getHomeRouteForRole(selectedRole.id));
    } else {
      setError("Invalid username or password. Please try again.");
    }

    setIsLoading(false);
  };

  const activeRole = roles.find((r) => r.id === selectedRole?.id);

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-0 -right-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 left-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-6000" />
        </div>
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10 animate-fadeInUp">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              EduVerse <span className="text-blue-400">LMS</span>
            </h1>
          </div>
          <p className="text-blue-200/70 text-lg font-light">
            Learning Management System
          </p>
        </div>

        {/* Role Selection / Login Form */}
        {!selectedRole ? (
          <div className="animate-fadeInUp">
            <p className="text-center text-blue-100/80 mb-8 text-sm font-medium uppercase tracking-widest">
              Select your role to continue
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {roles.map((role, index) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role)}
                    className={`group relative bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 text-center transition-all duration-500 hover:bg-white/[0.12] hover:border-white/[0.18] hover:scale-[1.04] hover:${role.shadow} hover:shadow-2xl focus:outline-none focus:ring-2 focus:${role.ring} focus:ring-offset-2 focus:ring-offset-transparent`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Glow effect on hover */}
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500`}
                    />

                    <div className="relative">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-white text-lg font-semibold mb-1">
                        {role.label}
                      </h3>
                      <p className="text-blue-200/50 text-xs leading-relaxed">
                        {role.description}
                      </p>
                    </div>

                    {/* Bottom accent bar */}
                    <div
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r ${role.color} group-hover:w-3/4 transition-all duration-500 rounded-full`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto animate-fadeInUp">
            {/* Back button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-blue-300/80 hover:text-white text-sm mb-6 transition-colors duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to role selection
            </button>

            {/* Login Card */}
            <div className="bg-white/[0.07] backdrop-blur-2xl border border-white/[0.1] rounded-3xl p-8 shadow-2xl">
              {/* Role badge */}
              <div className="flex items-center justify-center mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeRole.color} flex items-center justify-center shadow-lg ${activeRole.shadow}`}
                >
                  <activeRole.icon className="w-7 h-7 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white text-center mb-1">
                {activeRole.label} Login
              </h2>
              <p className="text-blue-200/50 text-sm text-center mb-8">
                Enter your credentials to access the portal
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div>
                  <label className="block text-blue-100/80 text-sm font-medium mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="login-username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={`Enter ${activeRole.label.toLowerCase()} username`}
                      className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300 text-sm"
                      autoComplete="username"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-blue-100/80 text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="login-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 pr-11 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300 text-sm"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200/40 hover:text-white transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3 text-red-300 text-sm animate-shake">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  id="login-submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 rounded-xl text-white font-semibold text-sm bg-gradient-to-r ${activeRole.color} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${activeRole.shadow} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Demo credentials hint */}
              <div className="mt-6 pt-5 border-t border-white/[0.06]">
                <p className="text-blue-200/30 text-xs text-center mb-2">
                  Demo Credentials
                </p>
                <div className="bg-white/[0.04] rounded-lg px-3 py-2 text-center">
                  <p className="text-blue-200/50 text-xs font-mono">
                    {activeRole.id} / {activeRole.id}123
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-blue-200/20 text-xs mt-10">
          &copy; 2026 EduVerse LMS. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
