import { Mail, Phone, UserRound } from "lucide-react";
import GlassCard from "../components/GlassCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { developer } from "../data/navigation.js";
import { formatDate } from "../utils/formatters.js";

export default function Profile() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title="Developer & Account Details"
        description="Portfolio owner information and authenticated user profile."
      />

      <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <GlassCard>
          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-mint text-4xl font-black text-ink">
            {developer.name.charAt(0)}
          </div>
          <h2 className="mt-6 text-3xl font-bold">{developer.name}</h2>
          <p className="mt-2 text-white/60">{developer.role}</p>
          <div className="mt-6 space-y-3">
            <p className="flex items-center gap-3 text-white/70">
              <Mail className="h-5 w-5 text-mint" />
              {developer.email}
            </p>
            <p className="flex items-center gap-3 text-white/70">
              <Phone className="h-5 w-5 text-coral" />
              {developer.phone}
            </p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3">
            <UserRound className="h-6 w-6 text-mint" />
            <h2 className="text-2xl font-bold">Authenticated Account</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ProfileField label="Full Name" value={user?.full_name} />
            <ProfileField label="Email" value={user?.email} />
            <ProfileField label="Phone" value={user?.phone || "Not provided"} />
            <ProfileField label="Role" value={user?.role} />
            <ProfileField label="Status" value={user?.is_active ? "Active" : "Disabled"} />
            <ProfileField label="Created" value={formatDate(user?.created_at)} />
          </div>
        </GlassCard>
      </div>
    </>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-white/40">{label}</p>
      <p className="mt-2 font-semibold text-white">{value}</p>
    </div>
  );
}
