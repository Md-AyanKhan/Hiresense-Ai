import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import GlassCard from "../components/GlassCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiError } from "../utils/formatters.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from || "/dashboard");
    } catch (err) {
      setError(apiError(err, "Unable to login."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-ink bg-app-radial px-4 py-10 text-white">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/" className="mx-auto mb-8 flex w-max items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint font-black text-ink">H</span>
          <span className="text-xl font-bold">HireSense AI</span>
        </Link>
        <GlassCard>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-white/50">Sign in to continue your resume intelligence workflow.</p>
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <input
              className="field"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
            <input
              className="field"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
            {error ? <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p> : null}
            <Button type="submit" icon={ArrowRight} loading={loading} className="w-full">
              Login
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-white/50">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-mint">
              Create an account
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
