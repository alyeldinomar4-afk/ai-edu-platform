import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Loader2, AlertCircle, Github } from "lucide-react";
import Button from "../../components/ui/Button";
// import { useAuth } from '../../auth/useAuth';
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";

const LoginPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await signIn({
        data: formData,
        mode: "signin",
      });
      // Redirect based on role or 'from' location
      if (from !== "/") {
        navigate(from, { replace: true });
      } else {
        if (user.role === "admin") navigate("/admin/dashboard");
        else if (user.role === "instructor") navigate("/instructor/dashboard");
        else navigate("/learner/dashboard");
      }
    } catch (err) {
      setError(err.message || t("common.error"));
      setLoading(false);
    }
  };

  return (
    <div className="transition-colors duration-300">
      <div className="mb-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-slide-up">
          {t("auth.login.title")}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm sm:text-base animate-slide-up [animation-delay:100ms] opacity-0 [animation-fill-mode:forwards]">
          {t("auth.login.subtitle")}
        </p>
        {import.meta.env.DEV && (
          <div className="mt-4 text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/50 p-2 rounded border border-slate-100 dark:border-slate-700 inline-block pointer-events-none animate-slide-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
            <p>Student: user@test.com / 123456</p>
            <p>Instructor: instructor@test.com / 123456</p>
            <p>Admin: admin@test.com / admin123</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2 animate-shake">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 animate-slide-up [animation-delay:300ms] opacity-0 [animation-fill-mode:forwards]"
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1"
          >
            {t("auth.login.emailLabel")}
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="appearance-none block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1"
          >
            {t("auth.login.passwordLabel")}
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="appearance-none block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* TODO: Implement remember me - save token with longer expiry in localStorage */}
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-700 rounded dark:bg-slate-900 cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
            >
              {t("auth.login.rememberMe")}
            </label>
          </div>

          <div className="text-sm">
            <Link
              to="/forgot-password"
              size="sm"
              className="font-medium text-primary hover:text-primary-dark cursor-pointer font-bold"
            >
              {t("auth.login.forgotPassword")}
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full justify-center h-12 shadow-lg shadow-primary/20"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            t("auth.login.submit")
          )}
        </Button>
      </form>

      <div className="mt-8 animate-slide-up [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-medium">
              {t("auth.login.orContinue")}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            type="button"
            className="w-full justify-center gap-2 font-bold dark:border-slate-800 group"
            onClick={() => console.log("Google login clicked")}
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                className="text-blue-500"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.33 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                className="text-green-500"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.68-.35-1.4-.35-2.09s.13-1.41.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                className="text-yellow-500"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                className="text-red-500"
              />
            </svg>
            Google
          </Button>
          <Button
            variant="outline"
            type="button"
            className="w-full justify-center gap-2 font-bold dark:border-slate-800 group"
            onClick={() => console.log("GitHub login clicked")}
          >
            <Github className="w-5 h-5 transition-transform group-hover:scale-110" />
            GitHub
          </Button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400 animate-slide-up [animation-delay:500ms] opacity-0 [animation-fill-mode:forwards]">
        {t("auth.login.noAccount")}{" "}
        <Link
          to="/register"
          className="font-bold text-primary hover:text-primary-dark cursor-pointer underline underline-offset-4"
        >
          {t("auth.login.signUp")}
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
