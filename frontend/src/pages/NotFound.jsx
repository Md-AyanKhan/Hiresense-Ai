import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink bg-app-radial px-4 text-center text-white">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-mint">404</p>
        <h1 className="mt-4 text-5xl font-black">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-white/60">The requested HireSense AI route does not exist.</p>
        <Link to="/dashboard" className="mt-8 inline-flex">
          <Button icon={ArrowLeft}>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
