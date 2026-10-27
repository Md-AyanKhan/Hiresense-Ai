import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import GlassCard from "../components/GlassCard.jsx";
import { developer } from "../data/navigation.js";
import { useAuth } from "../context/AuthContext.jsx";
import { apiError } from "../utils/formatters.js";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: developer.name,
    email: developer.email,
    phone: developer.phone,
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(form);
      navigate("/dashboard");
    } catch (err) {
      setError(apiError(err, "Unable to create account."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-ink bg-app-radial px-4 py-10 text-white">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <Link to="/" className="mx-auto mb-8 flex w-max items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint font-black text-ink">H</span>
          <span className="text-xl font-bold">HireSense AI</span>
        </Link>
        <GlassCard>
          <h1 className="text-3xl font-bold">Create account</h1>
          <p className="mt-2 text-sm text-white/50">The configured developer email receives admin access automatically.</p>
          <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
            <input
              className="field"
              placeholder="Full name"
              value={form.full_name}
              onChange={(event) => setForm({ ...form, full_name: event.target.value })}
              required
            />
            <div className="grid gap-4 md:grid-cols-2">
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
                placeholder="Phone"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
              />
            </div>
            <input
              className="field"
              type="password"
              placeholder="Password, minimum 8 characters"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              minLength={8}
              required
            />
            {error ? <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p> : null}
            <Button type="submit" icon={ArrowRight} loading={loading} className="w-full">
              Signup
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-white/50">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-mint">
              Login
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
